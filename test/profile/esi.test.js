var Profile = require('../../lib/profile/esi')
  , fs = require('fs')


describe('Esi.parse', function() {
  
  describe('profile with "verify" endpoint content', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/esi/esi-verify.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
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
  });
   
});