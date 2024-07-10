const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const logger = require('./logger');

const cors = require('cors');

async function startLabs(server) {
    const page = path.resolve(__dirname, '../build', 'index.html');

    try {
        server.use(bodyParser.json());

        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));

        // setup sane defaults for CORS and HTTP headers
        // server.use(helmet());
        server.use(
            cors({
                allowedHeaders: ['sessionId', 'Content-Type'],
                exposedHeaders: ['sessionId'],
                origin: '*',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                preflightContinue: false,
            })
        );

        // setup routes
        server.get('/isAlive', (req, res) => res.send('Alive'));
        server.get('/isReady', (req, res) => res.send('Ready'));

        server.use(express.static(path.join(__dirname, '../build')));

        const restream = (proxyReq, req, res, options) => {
            if (req.body) {
                let bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        };

        server.use(
            '/api',
            createProxyMiddleware({
                target: 'http://tiltak-refusjon-api-labs',
                onProxyReq: restream,
                changeOrigin: true,
                proxyTimeout: 30000,
                secure: true,
                logLevel: 'info',
                onError: (err, req, res) => {
                    logger.error('error in proxy', err, req, res);
                },
            })
        );

        server.use(
            '/dekoratoren/env',
            asyncHandler(async (req, res) => {
                const response = await axios.get(
                    'https://www.nav.no/dekoratoren/env?context=arbeidsgiver&feedback=false'
                );
                res.json({ ...response.data, APP_URL: '/dekoratoren', LOGOUT_URL: '/logout' });
            })
        );
        server.use(
            '/dekoratoren/api/auth',
            asyncHandler(async (req, res) => {
                try {
                    const response = await axios.get(
                        'http://tiltak-refusjon-api-labs/api/arbeidsgiver/innlogget-bruker',
                        {
                            headers: req.headers,
                        }
                    );
                    res.json({ authenticated: true, name: response.data.identifikator || '' });
                } catch (error) {
                    res.json({ authenticated: false });
                }
            })
        );
        server.use('/logout', (req, res) => {
            res.clearCookie('tokenx-token');
            res.clearCookie('aad-token');
            res.redirect('/');
        });

        server.use('/dekoratoren', createProxyMiddleware({ target: 'https://www.nav.no', changeOrigin: true }));

        server.get('/*', (req, res) => {
            res.status(200);
            res.sendFile(page);
        });

        const port = 3000;
        server.listen(port, () => logger.info(`Listening on port ${port}`));
    } catch (error) {
        logger.error('Error during start-up', error);
    }
}

module.exports = { startLabs };
