import express from 'express';
import { generators } from 'openid-client';
import path from 'path';
import idporten from './auth/idporten';
import { frontendTokenSetFromSession } from './auth/utils';
import config from './config';
import logger from './logger';
import apiProxy from './proxy/api-proxy';
import decoratorProxy from './proxy/decorator-proxy';

const asyncHandler = require('express-async-handler');

const router = express.Router();

const setup = (tokenxClient, idportenClient) => {
    // Unprotected
    router.get('/isAlive', (req, res) => res.send('Alive'));
    router.get('/isReady', (req, res) => res.send('Ready'));

    router.get(
        '/login',
        asyncHandler(async (req, res) => {
            // lgtm [js/missing-rate-limiting]
            logger.info('get login async handler working...');
            const session = req.session;
            session.nonce = generators.nonce();
            session.state = generators.state();
            res.redirect(idporten.authUrl(session, idportenClient));
        })
    );

    router.get(
        '/oauth2/callback',
        asyncHandler(async (req, res) => {
            const session = req.session;

            try {
                const tokenSet = await idporten.validateOidcCallback(idportenClient, req);
                session.frontendTokenSet = tokenSet;
                session.state = null;
                session.nonce = null;
                if (session.redirectTo) {
                    res.redirect(session.redirectTo);
                } else {
                    res.redirect('/');
                }
            } catch (error) {
                logger.error(error);
                session.destroy();
                res.sendStatus(403);
            }
        })
    );

    const ensureAuthenticated = async (req, res, next) => {
        const frontendTokenSet = frontendTokenSetFromSession(req);
        const authExpected = req.headers?.referer?.split('nav.no')?.[1]?.includes('refusjon');

        if (authExpected && !frontendTokenSet) {
            logger.info('redirect to /login');
            res.redirect(301, `${process.env.HOST}/login`);
        } else if (authExpected && frontendTokenSet.expired()) {
            try {
                req.session.frontendTokenSet = await idporten.refresh(idportenClient, frontendTokenSet);
                next();
            } catch (err) {
                logger.error('Feil ved refresh av token', err);
                req.session.destroy();
                res.redirect(301, `${process.env.HOST}/login`);
            }
        } else {
            next();
        }
    };

    router.use(asyncHandler(ensureAuthenticated));

    // Protected
    router.get('/session', (req, res) => {
        res.json(req.session);
    });

    router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect(idportenClient.endSessionUrl({ post_logout_redirect_uri: config.idporten().logoutRedirectUri }));
    });

    apiProxy.setup(router, tokenxClient);
    decoratorProxy.setup(router);

    router.use(express.static(path.join(__dirname, '../build')));

    router.get(['/*'], (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
    });
    return router;
};

export default { setup };
