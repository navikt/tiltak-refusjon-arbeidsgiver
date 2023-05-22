import express from 'express';
import path from 'path';
import apiProxy from './proxy/api-proxy';
import decoratorProxy from './proxy/decorator-proxy';

const asyncHandler = require('express-async-handler');

const hostname = process.env.HOST ?? '';
const page = path.resolve(__dirname, '../build', 'index.html');
const setHostnamePath = (path) => hostname.concat(path);
const router = express.Router();

const redirectUrlTilRefusjonsside = setHostnamePath('/oauth2/login?redirect=/refusjon');

const setup = (tokenxClient) => {
    // Unprotected
    router.get('/isAlive', (req, res) => res.send('Alive'));
    router.get('/isReady', (req, res) => res.send('Ready'));

    router.get('/login', (req, res) => res.redirect(302, redirectUrlTilRefusjonsside));

    const ensureAuthenticated = async (req, res, next) => {
        if (!req.headers.authorization) {
            res.redirect(302, redirectUrlTilRefusjonsside);
        } else {
            next();
        }
    };

    router.all(['/refusjon', '/refusjon/*'], asyncHandler(ensureAuthenticated));

    router.get('/logout', (req, res) => res.redirect(301, setHostnamePath('/oauth2/logout')));

    apiProxy.setup(router, tokenxClient);
    decoratorProxy.setup(router);

    router.use(express.static(path.join(__dirname, '../build')));

    router.get('/*', (req, res) => {
        res.status(200);
        res.sendFile(page);
    });
    return router;
};

export default { setup };
