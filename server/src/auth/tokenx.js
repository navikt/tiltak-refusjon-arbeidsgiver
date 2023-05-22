import { custom, Issuer } from 'openid-client';
import config from '../config';
import httpProxy from '../proxy/http-proxy';
import logger from '../logger';

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
    const startTid = Date.now();
    const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

    const now = Math.floor(Date.now() / 1000);
    const additionalClaims = {
        clientAssertionPayload: {
            nbf: now,
            aud: [tokenxClient.issuer.metadata.token_endpoint],
        },
    };
    const backendTokenSet = await tokenxClient.grant(
        {
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
            audience: config.api().audience,
            subject_token: authToken,
        },
        additionalClaims
    );

    logger.info(`Kall til tokenX tok ${Date.now() - startTid}`);

    return backendTokenSet.access_token;
};

export default { client, getTokenExchangeAccessToken };
