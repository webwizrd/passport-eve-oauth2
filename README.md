[![Build Status](https://travis-ci.org/webwizrd/passport-eve-oauth2.svg?branch=master)](https://travis-ci.org/webwizrd/passport-eve-oauth2)
[![Coverage Status](https://coveralls.io/repos/github/webwizrd/passport-eve-oauth2/badge.svg)](https://coveralls.io/github/webwizrd/passport-eve-oauth2)

# passport-eve-oauth2

[Passport](http://passportjs.org/) strategy for authenticating with [EVE Online's](http://www.eveonline.com/) ESI
API using OAuth 2.0.

This module lets you authenticate using your EVE Online Login in your Node.js applications.
By plugging into Passport, EVE Online authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
$ npm install passport-eve-oauth2
```

## Usage

#### Create an Application

Before using `passport-eve-oauth2`, you must register an application with
ESI.  If you have not already done so, a new application can be created in the
[EVE Online Developers Site](https://developers.eveonline.com/applications).
Your application will be issued a client ID and client secret, which need to be
provided to the strategy.  You will also need to configure a redirect URI which
matches the route in your application.

#### Configure Strategy

The EVE Online authentication strategy authenticates users using an EVE Online account
and OAuth 2.0 tokens.  The client ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated EVE Online Character's
ID.  The `verify` callback must call `cb` providing a Character to
complete authentication.

```javascript
var EveOAuth2Strategy = require('passport-eve-oauth2').Strategy;

passport.use(new EveOAuth2Strategy({
    clientID: EVE_APPLICATION_CLIENT_ID,
    clientSecret: EVE_APPLICATION_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/eve/callback",
    state: "mySecretStateString"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ characterID: profile.CharacterID }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'eveOnline'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/eve',
  passport.authenticate('eveOnline'));

app.get('/auth/eve/callback', 
  passport.authenticate('eveOnline', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  ```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Facebook.  However, because both Facebook and EVE Online
use OAuth 2.0, the code is similar.  Simply replace references to Facebook with
corresponding references to EVE Online.

There is also an [EVE SSO guide on the ESI-docs website](https://docs.esi.evetech.net/docs/sso/)

## Sponsorship

Passport is open source software.  Ongoing development is made possible by
generous contributions from [individuals and corporations](https://github.com/jaredhanson/passport/blob/master/SPONSORS.md).
To learn more about how you can help keep this project financially sustainable,
please visit Jared Hanson's page on [Patreon](https://www.patreon.com/jaredhanson).

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2019 Andy <[https://github.com/webwizrd](https://github.com/webwizrd)>


## Shoutouts

A big THANK YOU to Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)> for creating passportJS !