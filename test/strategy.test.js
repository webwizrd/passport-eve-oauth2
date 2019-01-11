/* global describe, it, expect */
/* jshint expr: true */

var EsiOauth2Strategy = require('../lib/strategy')
  , chai = require('chai')
  , expect = require('chai').expect;

chai.use(require('chai-passport-strategy'));

describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new EsiOauth2Strategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function() {});
    
    it('should be named eveOnline', function() {
      expect(strategy.name).to.equal('eveOnline');
    });
  })
  
  describe('constructed with undefined options', function() {
    it('should throw an Error', function() {
      expect(function() {
        var strategy = new EsiOauth2Strategy(undefined, function(){});
      }).to.throw(Error);
    });
  })
  
  describe('authorization request with documented parameters', function() {
    var strategy = new EsiOauth2Strategy({
      clientID: 'ABC123',
      clientSecret: 'secret',
      callbackURL: 'https://www.myUrl.com/auth/callback',
      scope: 'pub',
      state: 'randomstring'
    }, function() {});
    
    
    var url = new String;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate();
    });
  

    // can't validate encoded "state" parameter - validate length, beginning and end of url instead 
    it('should be redirected', function() {
      expect(url.length).to.equal(183);
      expect(url.substr(0,142)).to.equal('https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=https%3A%2F%2Fwww.myUrl.com%2Fauth%2Fcallback&scope=pub&state=');
      expect(url.substr(166,183)).to.equal('&client_id=ABC123');
    });
  }); // authorization request with documented parameters
});