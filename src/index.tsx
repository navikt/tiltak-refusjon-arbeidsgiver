import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { init as Sentry, Integrations, captureException, configureScope } from '@sentry/react';

// sentry init
Sentry({
    dsn: 'https://6e57e48b384e45d797d8278d9e963916@sentry.gc.nav.no/87',
    release: process.env.GIT_COMMIT_HASH || 'unknown',
    environment: window.location.hostname,
    integrations: [new Integrations.Breadcrumbs({ console: false })],
    autoSessionTracking: false,
});
configureScope((scope) => {
    scope.setTag('commit', process.env.GIT_COMMIT_HASH);
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
