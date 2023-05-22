import 'dotenv/config';

import logger from './logger';

const envVar = ({ name, required = true }) => {
    if (!process.env[name] && required) {
        logger.error(`Missing required environment variable '${name}'`);
        process.exit(1);
    }
    return process.env[name];
};

const server = () => {
    return {
        host: envVar({ name: 'HOST', required: false }) || 'localhost', // should be equivalent to the URL this application is hosted on for correct CORS origin header
        port: envVar({ name: 'PORT', required: false }) || 3000,
        proxy: envVar({ name: 'HTTP_PROXY', required: false }), // optional, only set if requests to Azure AD must be performed through a corporate proxy (i.e. traffic to login.microsoftonline.com is blocked by the firewall)
        sessionKey: envVar({ name: 'SESSION_KEY' }),
        useSecureCookies: !!envVar({ name: 'NAIS_CLUSTER_NAME', required: false }),
    };
};

const tokenx = () => {
    return {
        discoveryUrl: envVar({ name: 'TOKEN_X_WELL_KNOWN_URL' }),
        clientID: envVar({ name: 'TOKEN_X_CLIENT_ID' }),
        privateJwk: envVar({ name: 'TOKEN_X_PRIVATE_JWK' }),
        tokenEndpointAuthMethod: 'private_key_jwt',
    };
};

const idporten = () => {
    return {
        discoveryUrl: envVar({ name: 'IDPORTEN_WELL_KNOWN_URL' }),
        clientID: envVar({ name: 'IDPORTEN_CLIENT_ID' }),
        clientJwk: envVar({ name: 'IDPORTEN_CLIENT_JWK' }),
        redirectUri: envVar({ name: 'IDPORTEN_REDIRECT_URI' }),
        logoutRedirectUri: 'https://nav.no',
        responseType: 'code',
        responseMode: 'query',
        scope: 'openid profile',
        tokenEndpointAuthMethod: 'private_key_jwt',
        tokenEndpointAuthSigningAlg: 'RS256',
    };
};

const api = () => {
    logger.info(`Loading reverse proxy config from API_* [CLIENT_ID, URL]`);
    const scopes = envVar({ name: 'API_SCOPES', required: false });
    return {
        audience: envVar({ name: 'API_AUDIENCE' }),
        url: envVar({ name: 'API_URL' }),
        scopes: scopes ? scopes.split(',') : [],
    };
};

export default {
    server,
    api,
    tokenx,
    idporten,
};
