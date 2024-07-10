const proxy = require('express-http-proxy');
const config = require('../config');
const tokenx = require('../auth/tokenx');

const setup = (router, tokenxClient) => {
    router.use(
        '/api',
        proxy(config.api().url, {
            proxyReqPathResolver: (req) => {
                return req.originalUrl;
            },
            proxyReqOptDecorator: async (options, req) => {
                const accessToken = await tokenx.getTokenExchangeAccessToken(tokenxClient, req);
                options.headers.Authorization = `Bearer ${accessToken}`;
                return options;
            },
        })
    );
};

module.exports = { setup };
