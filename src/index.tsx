import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Sentry from '@sentry/browser';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: 'https://6e57e48b384e45d797d8278d9e963916@sentry.gc.nav.no/87',
        release: process.env.GIT_COMMIT_HASH || 'unknown',
        environment: window.location.hostname,
        integrations: [new Sentry.Integrations.Breadcrumbs()],
    });
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
