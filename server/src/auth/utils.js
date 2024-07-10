const { TokenSet } = require('openid-client');

export const frontendTokenSetFromSession = (req) => {
    return req.session.frontendTokenSet ? new TokenSet(req.session.frontendTokenSet) : undefined;
};

export const backendTokenSetFromSession = (req) => {
    return req.session.backendTokenSet ? new TokenSet(req.session.backendTokenSet) : undefined;
};
