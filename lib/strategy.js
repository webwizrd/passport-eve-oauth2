// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , EsiProfile = require('./profile/esi')
  , EsiError = require('./errors/esierror')

/**
 * `Strategy` constructor.
 *
 * The EVE Online authentication strategy authenticates requests by delegating to
 * EVE Online ESI using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your ESI application's client id
 *   - `clientSecret`  your ESI application's client secret
 *   - `callbackURL`   URL to which ESI will redirect the user after granting authorization (must match the one in your application definition)
 *   - `scope`         the requested Scopes, delimited by spaces
 *   - `state`         custom string which will be returned with the API response 
 *
 * Examples:
 *
 *     passport.use(new EVEonlineStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/callback'
 *       },
 *       // profile is empty
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://login.eveonline.com/v2/oauth/authorize/';
  options.tokenURL = options.tokenURL || 'https://login.eveonline.com/v2/oauth/token';
  options.scope = options.scope || 'publicData';

  OAuth2Strategy.call(this, options, verify);
  this._oauth2.useAuthorizationHeaderforGET(true);
  this.name = 'eveOnline';
  
  this._userProfileURL = options.userProfileURL || 'https://esi.evetech.net/verify/';
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve character information used for authentication.
 *
 * This function constructs a profile with the following properties,
 * which are returned by ESI's /validate endpoint after logging in:
 *
 *   - `CharacterID`      
 *   - `CharacterName`
 *   - `ExpiresOn`          timestamp number
 *   - `Scopes`             granted scopes
 *   - `TokenType`          JWT
 *   - `CharacterOwnerHash` unique, only changes when character moves to a new user account
 * 
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */

Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;
    
    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }
      
      if (json && json.error && json.error_message) {
        return done(new EsiError(json.error.message, json.error.code));
      }else if (json && json.error && json.error_description) {
        return done(new EsiError(json.error_description, json.error));
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }
    
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }
    
    profile = EsiProfile.parse(json);
    
    profile.provider  = 'eveonline';
    profile._raw = body;
    profile._json = json;
    
    done(null, profile);
  });
}

/**
 * Return extra EVE Online-specific parameters to be included in the authorization
 * request.
 * See https://docs.esi.evetech.net/docs/sso/sso_authorization_flow.html
 *
 * @param {object} options
 * @return {object}
 * @access protected
 */
Strategy.prototype.authorizationParams = function(options) {
  var params = {};

  // required (any character sequence) - can be used to authenticate token response 
  if (options.state) {
    params['state'] = options.state;
  }

  // ESI requires callbackURL URLEncoded as redirect_url
  if(options.callbackURL){
    params['redirect_uri'] = options.callbackURL;
  }
 
  return params;
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
