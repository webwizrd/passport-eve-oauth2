/**
 * Parse profile.
 *
 * Parses character information as fetched from EVE Online's ESI API /verify endpoint
 * 
 * Public character information from the `/characters/{character_id}/` endpoint
 * should be retrieved by the consuming application if validation against corporation 
 * or alliance membership is required.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};

  profile.CharacterID = json.CharacterID;
  profile.CharacterName = json.CharacterName;
  profile.ExpiresOn = Date.parse(json.ExpiresOn);
  profile.Scopes = json.Scopes;
  profile.TokenType = json.TokenType;
  profile.CharacterOwnerHash = json.CharacterOwnerHash;

  return profile;
};
