const { startLabs } = require('./labs');
const express = require('express');
const bodyParser = require('body-parser');
const tokenx = require('./auth/tokenx');
const routes = require('./routes');
const logger = require('./logger');

const cors = require('cors');

async function startNormal(server) {
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

        const tokenxAuthClient = await tokenx.client();

        // setup routes
        server.use('/', routes.setup(tokenxAuthClient));

        const port = 3000;
        server.listen(port, () => logger.info(`Listening on port ${port}`));
    } catch (error) {
        logger.error('Error during start-up', error);
    }
}

if (process.env.MILJO === 'dev-gcp-labs') {
    startLabs(express()).catch((err) => logger.info(err));
} else {
    startNormal(express()).catch((err) => logger.info(err));
}
