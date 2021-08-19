import express from 'express';
import { generators } from 'openid-client';
import path from 'path';
import idporten from './auth/idporten';
import { frontendTokenSetFromSession } from './auth/utils';
import config from './config';
import logger from './logger';
import apiProxy from './proxy/api-proxy';
import decoratorProxy from './proxy/decorator-proxy';
import sentryProxy from './proxy/sentry-proxy';

const asyncHandler = require('express-async-handler');

const router = express.Router();
const hostname = process.env.HOST ?? '';

const setHostnamePath = (path) => hostname.concat(path);

const setup = (tokenxClient, idportenClient) => {
    // Unprotected
    router.get('/isAlive', (req, res) => res.send('Alive'));
    router.get('/isReady', (req, res) => res.send('Ready'));

    router.get(
        '/login',
        asyncHandler(async (req, res) => {
            // lgtm [js/missing-rate-limiting]
            const session = req.session;
            session.nonce = generators.nonce();
            session.state = generators.state();
            response.set('location', setHostnamePath('/login'));
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-Requested-With');
            await res.redirect(idporten.authUrl(session, idportenClient));
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
                    res.redirect('/refusjon');
                }
            } catch (error) {
                logger.error(error);
                session.destroy();
                res.sendStatus(403);
            }
        })
    );

    const ensureAuthenticated = async (request, response, next) => {
        const frontendTokenSet = frontendTokenSetFromSession(request);
        const authExpected = request.headers?.referer?.split('nav.no')?.[1]?.includes('refusjon');

        if (authExpected && !frontendTokenSet) {
            logger.info('redirect to /login');
            logger.info('auth expected ', authExpected);
            response.set('location', setHostnamePath('/login'));
            response.status(301);
            response.redirect(301, setHostnamePath('/login')).send();
        } else if (authExpected && frontendTokenSet.expired()) {
            try {
                request.session.frontendTokenSet = await idporten.refresh(idportenClient, frontendTokenSet);
                next();
            } catch (err) {
                logger.error('Feil ved refresh av token', err);
                request.session.destroy();
                response.set('location', setHostnamePath('/login'));
                response.status(301);
                response.redirect(301, setHostnamePath('/login')).send();
            }
        } else {
            next();
        }
    };

    router.all('*', asyncHandler(ensureAuthenticated));

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
    //sentryProxy.setup(router);

    router.use(express.static(path.join(__dirname, '../build')));

    router.get(['/*'], (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
    });
    return router;
};

export default { setup };
