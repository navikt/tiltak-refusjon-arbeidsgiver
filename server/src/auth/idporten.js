const { custom, Issuer } = require('openid-client');
const config = require('../config');
const httpProxy = require('../proxy/http-proxy');
const logger = require('../logger');

const metadata = () => {
    const idportenConfig = config.idporten();

    return {
        client_id: idportenConfig.clientID,
        redirect_uris: [idportenConfig.redirectUri],
        response_types: idportenConfig.responseType,
        token_endpoint_auth_method: idportenConfig.tokenEndpointAuthMethod,
        token_endpoint_auth_signing_alg: idportenConfig.tokenEndpointAuthSigningAlg,
    };
};

let idportenMetadata = null;

const client = async () => {
    const idportenConfig = config.idporten();

    const httpProxyAgent = httpProxy.agent();
    if (httpProxyAgent) {
        custom.setHttpOptionsDefaults({
            agent: httpProxyAgent,
        });
    }
    idportenMetadata = await Issuer.discover(idportenConfig.discoveryUrl);
    logger.info(`Discovered issuer ${idportenMetadata.issuer}`);
    const jwk = JSON.parse(idportenConfig.clientJwk);
    return new idportenMetadata.Client(metadata(), { keys: [jwk] });
};

const authUrl = (session, idportenClient) => {
    const idportenConfig = config.idporten();

    return idportenClient.authorizationUrl({
        scope: idportenConfig.scope,
        redirect_uri: idportenConfig.redirectUri,
        response_type: idportenConfig.responseType,
        response_mode: idportenConfig.responseMode,
        nonce: session.nonce,
        state: session.state,
        resource: 'https://nav.no',
    });
};

const validateOidcCallback = async (idportenClient, req) => {
    const idportenConfig = config.idporten();

    const params = idportenClient.callbackParams(req);
    const nonce = req.session.nonce;
    const state = req.session.state;
    return await idportenClient.callback(
        idportenConfig.redirectUri,
        params,
        { nonce, state },
        { clientAssertionPayload: { aud: idportenMetadata.metadata.issuer } }
    );
};

const refresh = (idportenClient, oldTokenSet) => {
    const additionalClaims = {
        clientAssertionPayload: {
            aud: idportenMetadata.issuer.metadata,
        },
    };
    return idportenClient.refresh(oldTokenSet, additionalClaims);
};

module.exports = { client, authUrl, validateOidcCallback, refresh };
