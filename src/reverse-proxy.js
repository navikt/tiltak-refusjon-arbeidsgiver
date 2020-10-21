import proxy from 'express-http-proxy';

const setup = (router) => {
    router.use("/api/*", proxy(process.env.API_URL, {
        parseReqBody: false,
        proxyReqPathResolver: (req) => {
            return req.originalUrl;
        },
        proxyReqOptDecorator: (options, req) => {
            const access_token = req.cookies["selvbetjening-idtoken"];
            if (access_token) {
                options.headers.Authorization = `Bearer ${access_token}`;
            }
            return options;
        }
    }));
};

export default {setup}