import { createProxyMiddleware } from 'http-proxy-middleware';

const setup = (router) => {
    router.use(
        '/https://sentry.gc.nav.no',
        createProxyMiddleware({ target: 'https://sentry.gc.nav.no', changeOrigin: true })
    );
};

export default { setup };
