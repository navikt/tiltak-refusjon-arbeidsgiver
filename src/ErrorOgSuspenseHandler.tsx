import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import * as React from 'react';
import { FunctionComponent, Suspense } from 'react';
import * as Sentry from '@sentry/react';
import HenterInntekterBoks from './refusjon/RefusjonSide/HenterInntekterBoks';

const ErrorOgSuspenseHandler: FunctionComponent<{}> = (props) => (
    <Sentry.ErrorBoundary
        fallback={({ error, componentStack, resetError }) => <AlertStripeFeil>Feil ved lasting.</AlertStripeFeil>}
    >
        <Suspense
            fallback={
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    <HenterInntekterBoks />
                </div>
            }
        >
            {props.children}
        </Suspense>
    </Sentry.ErrorBoundary>
);

export default ErrorOgSuspenseHandler;
