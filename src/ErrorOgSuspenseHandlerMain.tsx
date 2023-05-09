import * as Sentry from '@sentry/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { FunctionComponent, Suspense } from 'react';
import HvitBoks from './komponenter/hvitboks/HvitBoks';
import VerticalSpacer from './komponenter/VerticalSpacer';
import { Alert } from '@navikt/ds-react';

const ErrorOgSuspenseHandlerMain: FunctionComponent<{}> = (props) => (
    <Sentry.ErrorBoundary
        fallback={({ error, componentStack, resetError }) => (
            <>
                <Alert variant="warning" size="small">
                    <Undertittel>Det har oppstått en uventet feil. Forsøk å laste siden på nytt.</Undertittel>
                    <VerticalSpacer rem={0.5} />
                    <Normaltekst>
                        Teknisk feilkode: <i>{error?.message}</i>
                    </Normaltekst>
                </Alert>
            </>
        )}
    >
        <Suspense
            fallback={
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    <HvitBoks style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <NavFrontendSpinner type="XL" />
                    </HvitBoks>
                </div>
            }
        >
            {props.children}
        </Suspense>
    </Sentry.ErrorBoundary>
);

export default ErrorOgSuspenseHandlerMain;
