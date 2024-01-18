import express from 'express';
import path from 'path';
import apiProxy from './proxy/api-proxy';
import decoratorProxy from './proxy/decorator-proxy';

const asyncHandler = require('express-async-handler');

const page = path.resolve(__dirname, '../build', 'index.html');
const router = express.Router();

const setup = (tokenxClient) => {
    // Unprotected
    router.get('/isAlive', (req, res) => res.send('Alive'));
    router.get('/isReady', (req, res) => res.send('Ready'));

    const ensureAuthenticated = async (req, res, next) => {
        if (!req.headers['authorization']) {
            res.status(401).send();
        } else {
            next();
        }
    };

    router.all(['/refusjon', '/refusjon/*'], asyncHandler(ensureAuthenticated));

    router.get('/logout', (req, res) => {
        req.session.destroy();
        //res.redirect(idportenClient.endSessionUrl({ post_logout_redirect_uri: config.idporten().logoutRedirectUri }));
    });

    apiProxy.setup(router, tokenxClient);
    decoratorProxy.setup(router);

    router.use(express.static(path.join(__dirname, '../build')));

    router.get('/*', (req, res) => {
        res.status(200);
        res.sendFile(page);
    });
    // Vite legger javascript og css i assets mappen
    router.get('/assets/*', (req, res) => {
        res.status(200);
        res.sendFile(page);
    });
    return router;
};

export default { setup };
