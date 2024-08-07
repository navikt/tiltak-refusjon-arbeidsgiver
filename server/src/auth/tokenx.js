const { custom, Issuer } = require('openid-client');
const config = require('../config');
const httpProxy = require('../proxy/http-proxy');
const logger = require('../logger');

const metadata = () => {
    const tokenxConfig = config.tokenx();
    return {
        client_id: tokenxConfig.clientID,
        token_endpoint_auth_method: tokenxConfig.tokenEndpointAuthMethod,
    };
};

const client = async () => {
    const tokenxConfig = config.tokenx();

    const httpProxyAgent = httpProxy.agent();
    if (httpProxyAgent) {
        custom.setHttpOptionsDefaults({
            agent: httpProxyAgent,
        });
    }
    const issuer = await Issuer.discover(tokenxConfig.discoveryUrl);
    logger.info(`Discovered issuer ${issuer.issuer}`);
    const jwk = JSON.parse(tokenxConfig.privateJwk);
    return new issuer.Client(metadata(), { keys: [jwk] });
};

const getTokenExchangeAccessToken = async (tokenxClient, req) => {
    logger.info('Skal hente ny access token fra tokendings');
    const now = Math.floor(Date.now() / 1000);
    const additionalClaims = {
        clientAssertionPayload: {
            nbf: now,
            aud: [tokenxClient.issuer.metadata.token_endpoint],
        },
    };
    const bearerToken = req.headers['authorization'].replace('Bearer', '').trim();
    const backendTokenSet = await tokenxClient.grant(
        {
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
            audience: config.api().audience,
            subject_token: bearerToken,
        },
        additionalClaims
    );

    return backendTokenSet.access_token;
};

module.exports = { client, getTokenExchangeAccessToken };
