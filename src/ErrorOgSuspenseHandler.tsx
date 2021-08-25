import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import * as React from 'react';
import { FunctionComponent, Suspense } from 'react';
import * as Sentry from '@sentry/react';
import NavFrontendSpinner from 'nav-frontend-spinner';

const ErrorOgSuspenseHandler: FunctionComponent<{}> = (props) => {
    // const key = window.location.pathname;
    return (
        <Sentry.ErrorBoundary
            fallback={({ error, componentStack, resetError }) => {
                console.log('sentry error ', error);
                return (
                    <>
                        <AlertStripeFeil>Feil ved lasting.</AlertStripeFeil>
                    </>
                );
            }}
        >
            <Suspense fallback={<NavFrontendSpinner transparent={true} type="XL" />}>{props.children}</Suspense>
        </Sentry.ErrorBoundary>
    );
};

export default ErrorOgSuspenseHandler;
