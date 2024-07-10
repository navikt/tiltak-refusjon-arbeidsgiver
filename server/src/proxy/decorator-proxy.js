const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');
const asyncHandler = require('express-async-handler');

const setup = (router) => {
    router.use('/dekoratoren/api/auth', (req, res) => {
        res.json({ authenticated: true, name: '' });
    });

    router.use(
        '/dekoratoren/env',
        asyncHandler(async (req, res) => {
            const response = await axios.get(`${process.env.DECORATOR_URL}/env?context=arbeidsgiver&feedback=false`);
            res.json({
                ...response.data,
                API_INNLOGGINGSLINJE_URL: '/dekoratoren/api',
                APP_URL: '/dekoratoren',
                LOGOUT_URL: '/oauth2/logout',
            });
        })
    );

    router.use('/dekoratoren', createProxyMiddleware({ target: 'https://www.nav.no', changeOrigin: true }));
};

module.exports = { setup };
