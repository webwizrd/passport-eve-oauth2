/* global describe, it, before, expect */
/* jshint expr: true */

var EsiOauth2Strategy = require('../lib/strategy')
, expect = require('chai').expect;


describe('Strategy & user info', function() {
    
  describe('fetched from EVE Online ESI API', function() {
    var strategy = new EsiOauth2Strategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
  
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://esi.evetech.net/verify/') { return callback(new Error('incorrect url argument')); }
      if (accessToken != 'token') { return callback(new Error('incorrect token argument')); }
 
      var body = '{ \
        "CharacterID": "123456789",\
        "CharacterName": "Capsuleer1",\
        "ExpiresOn": "2020-01-10T19:39:05Z",\
        "Scopes": "PublicData",\
        "TokenType": "JWT",\
        "CharacterOwnerHash": "123DEF5KLNOWNABDF"\
      }';
      callback(null, body, undefined);
    };
    
    
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.CharacterID).to.equal('123456789');
      expect(profile.CharacterName).to.equal('Capsuleer1');
      expect(profile.ExpiresOn).to.equal(Date.parse('2020-01-10T19:39:05Z'));
      expect(profile.Scopes).to.equal('PublicData');
      expect(profile.TokenType).to.equal('JWT');
      expect(profile.CharacterOwnerHash).to.equal('123DEF5KLNOWNABDF');
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
  
  describe('error caused by malformed request (missing state parameter) when using Eve Online ESI API', function() {
    var strategy = new EsiOauth2Strategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
    
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://esi.evetech.net/verify/') { return callback(new Error('incorrect url argument')); }
      
      var body = '{"error":"invalid_request","error_description":"The state parameter is required."}';
      callback({ statusCode: 401, data: body });
    };
      
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('some token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('EsiError');
      expect(err.message).to.equal("The state parameter is required.");
      expect(err.code).to.equal("invalid_request");
    });
  });
  
  describe('error caused by invalid token when using Character info (/verify) endpoint', function() {
    var strategy = new EsiOauth2Strategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
    
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://esi.evetech.net/verify/') { return callback(new Error('incorrect url argument')); }
      
      var body = '{\n "error": "invalid_request",\n "error_description": "Invalid Credentials"\n}\n';
      callback({ statusCode: 401, data: body });
    };
      
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('invalid-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('EsiError');
      expect(err.message).to.equal("Invalid Credentials");
      expect(err.code).to.equal('invalid_request');
    });
  }); // error caused by invalid token when using Character info endpoint
  
  describe('error caused by malformed response', function() {
    var strategy =  new EsiOauth2Strategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
  
    strategy._oauth2.get = function(url, accessToken, callback) {
      var body = 'Hello, world.';
      callback(null, body, undefined);
    };
    
    
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse user profile');
    });
  }); // error caused by malformed response
  
  describe('internal error', function() {
    var strategy =  new EsiOauth2Strategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function verify(){});
    
    strategy._oauth2.get = function(url, accessToken, callback) {
      return callback(new Error('something went wrong'));
    }
    
    
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
      expect(err.oauthError).to.be.an.instanceOf(Error);
      expect(err.oauthError.message).to.equal('something went wrong');
    });
    
    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  }); // internal error
  
});
