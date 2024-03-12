import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import svgr from 'vite-plugin-svgr';
const axios = require('axios');

function parseCookies(request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function (cookie) {
        let [name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

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
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                bypass(req, res, options) {
                    const token = parseCookies(req)['tokenx-token'];
                    const headers = req.headers;
                    if (token) {
                        headers['Authorization'] = 'Bearer ' + token;
                    }
                    res.appendHeader('content-type', 'application/json');

                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });
                    req.on('end', () => {
                        axios
                            .request({
                                method: req.method,
                                url: 'http://localhost:8081' + req.url,
                                headers,
                                data: body,
                            })
                            .then(
                                (response) => {
                                    res.end(JSON.stringify(response.data));
                                },
                                (error) => {
                                    console.log('FEIL', error.response.data);
                                    res.statusCode = error.response.status;
                                    res.end(JSON.stringify(error.response.data));
                                }
                            );
                    });
                },
            },
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
                    const token = parseCookies(req)['tokenx-token'];
                    const headers = req.headers;
                    if (token) {
                        headers['Authorization'] = 'Bearer ' + token;
                    }
                    res.appendHeader('content-type', 'application/json');
                    axios
                        .get('http://localhost:8081/api/arbeidsgiver/innlogget-bruker', { headers, secure: false })
                        .then(
                            (response) => {
                                res.end(JSON.stringify({ ...response.data, ident: response.data.identifikator || '' }));
                            },
                            (error) => {
                                console.error('Feil i dekorator-auth', error.code);
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
