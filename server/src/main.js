import { startLabs } from './labs';
import express from 'express';
import session from './session';
import bodyParser from 'body-parser';
import cors from './cors';
import tokenx from './auth/tokenx';
import routes from './routes';
import idporten from './auth/idporten';
import logger from './logger';

async function startNormal(server) {
    try {
        server.use(bodyParser.json());

        session.setup(server);

        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));

        // setup sane defaults for CORS and HTTP headers
        // server.use(helmet());
        server.use(() => {
            const whitelist = [process.env.HOST, `${process.env.HOST}/refusjon`, '.nais.io', '.nav.no'];
            const isAllowedDomain = whitelist.some((domain) => origin?.endsWith(domain));
            const isLocalhost = origin?.startsWith('http://localhost:');
            if (isAllowedDomain || isLocalhost) {
                return cors;
            }
        });

        const tokenxAuthClient = await tokenx.client();
        const idportenAuthClient = await idporten.client();

        // setup routes
        server.use('/', routes.setup(tokenxAuthClient, idportenAuthClient));

        const port = 3000;
        server.listen(port, () => logger.info(`Listening on port ${port}`));
    } catch (error) {
        logger.error('Error during start-up', error);
    }
}

if (process.env.NAIS_CLUSTER_NAME === 'labs-gcp') {
    startLabs(express()).catch((err) => logger.info(err));
} else {
    startNormal(express()).catch((err) => logger.info(err));
}
