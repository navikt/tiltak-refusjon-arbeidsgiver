import proxy from 'express-http-proxy';
import config from '../config';
import tokenx from '../auth/tokenx';

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

export default { setup };
