import '@navikt/ds-css';
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
import './index.css';
import * as Sentry from '@sentry/browser';

// sentry init
Sentry.init({
    dsn: 'https://6e57e48b384e45d797d8278d9e963916@sentry.gc.nav.no/87',
    environment: window.location.hostname,
});

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container!);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
