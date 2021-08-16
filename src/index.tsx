import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { init as Sentry, Integrations, captureException } from '@sentry/react';

// sentry init
Sentry({
    dsn: 'https://3a5b579938bc4d6c9011c48d34af18f8@sentry.gc.nav.no/4',
    release: process.env.GIT_COMMIT_HASH || 'unknown',
    environment: window.location.hostname,
    integrations: [new Integrations.Breadcrumbs({ console: false })],
    autoSessionTracking: false,
});

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

export const sendSentryException = (message: Error | null) => {
    captureException(message);
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
