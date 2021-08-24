import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/browser';

// sentry init
Sentry.init({ dsn: 'https://6e57e48b384e45d797d8278d9e963916@sentry.gc.nav.no/87' });

/*
(function(send) {
    XMLHttpRequest.prototype.send = function(data) {
        this.addEventListener('readystatechange', function() {
        }, true);

        console.log('DATA!!!:',data);
        return data;

    };
})(XMLHttpRequest.prototype.send);
*/

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
