import session from 'express-session';
import config from './config';

const SESSION_MAX_AGE_MILLISECONDS = 60 * 60 * 1000;

const setup = (app) => {
    app.set('trust proxy', 1);
    const serverConfig = config.server();
    const options = {
        cookie: {
            maxAge: SESSION_MAX_AGE_MILLISECONDS,
            sameSite: 'lax',
            httpOnly: true,
        },
        secret: serverConfig.sessionKey,
        name: serverConfig.cookieName,
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
    };
    if (process.env.NODE_ENV !== 'development') {
        options.cookie.secure = true;
    }
    app.use(session(options));
};

export default { setup };
