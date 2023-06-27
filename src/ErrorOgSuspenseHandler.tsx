import * as React from 'react';
import { FunctionComponent, PropsWithChildren, Suspense } from 'react';
import * as Sentry from '@sentry/react';
import HenterInntekterBoks from './refusjon/RefusjonSide/HenterInntekterBoks';
import { Alert } from '@navikt/ds-react';

const ErrorOgSuspenseHandler: FunctionComponent<PropsWithChildren> = (props) => (
    <Sentry.ErrorBoundary
        fallback={({ error, componentStack, resetError }) => (
            <Alert variant="error" size="small">
                Feil ved lasting.
            </Alert>
        )}
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
