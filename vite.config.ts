import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import svgr from 'vite-plugin-svgr';
const axios = require('axios');

// https://vitejs.dev/config/
export default defineConfig({
    preview: {
        port: 3001,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src'),
        },
    },
    plugins: [react(), svgr()],

    server: {
        port: 3001,
        proxy: {
            '/api': { target: 'http://localhost:8081', changeOrigin: true },
            '/dekoratoren/env': {
                target: 'http://localhost:3001/',
                bypass(req, res, options) {
                    axios
                        .get(
                            'https://www.nav.no/dekoratoren/env?context=arbeidsgiver&feedback=false&level=Level4&redirectToApp=true'
                        )
                        .then(
                            (response) => {
                                res.end(
                                    JSON.stringify({
                                        ...response.data,
                                        API_DEKORATOREN_URL: '/dekoratoren/api',
                                        APP_URL: '/dekoratoren',
                                        LOGOUT_URL: '/logout',
                                    })
                                );
                            },
                            (error) => {
                                console.log('Feil i dekorator-env', error);
                                res.end(JSON.stringify({}));
                            }
                        );
                },
            },
            '/dekoratoren/api/auth': {
                target: 'http://localhost:3001',
                bypass(req, res, options) {
                    axios
                        .get('http://localhost:8081/api/arbeidsgiver/innlogget-bruker', {
                            headers: req.headers,
                            secure: false,
                        })
                        .then(
                            (response) => {
                                res.end(JSON.stringify({ ...response.data, ident: response.data.identifikator || '' }));
                            },
                            (error) => {
                                console.error('Feil i dekorator-auth', error);
                                res.end(JSON.stringify({ authenticated: false }));
                            }
                        );
                },
            },
            '/logout': {
                target: 'http://localhost:3001/',
                bypass(req, res, options) {
                    res.setHeader('set-cookie', 'tokenx-token=; max-age=0');
                    res.setHeader('set-cookie', 'aad-token=; max-age=0');
                    res.writeHead(302, { Location: '/' });
                    res.end();
                },
            },
            '/dekoratoren': {
                target: 'https://www.nav.no',
                changeOrigin: true,
            },
        },
    },
});
