// Type definitions for passport-eve-oauth2 1.0.1
// Project: https://github.com/webwizrd/passport-eve-oauth2#readme
// Definitions by: Andy https://github.com/webwizrd

import {Strategy, StrategyOptions, StrategyOptionsWithRequest, VerifyFunction, VerifyFunctionWithRequest} from 'passport-oauth2';

declare class EsiOAuth2Strategy extends Strategy {

    constructor(options: StrategyOptions, verify: VerifyFunction);
    constructor(options: StrategyOptionsWithRequest, verify: VerifyFunctionWithRequest);

    userProfile(accessToken: string, done: (err?: Error | null, profile?: EsiOAuth2Strategy.ESIProfileStructure) => void): void;
    authorizationParams(options: any): object;
}

declare namespace EsiOAuth2Strategy {
    
    interface ESIProfileStructure {
        CharacterID: number;
        CharacterName: string;
        ExpiresOn: number;
        Scopes: string;
        TokenType: string;
        CharacterOwnerHash: string;
        provider: string;
        _raw: string;
        _json: string;
    }
}

export = EsiOAuth2Strategy;