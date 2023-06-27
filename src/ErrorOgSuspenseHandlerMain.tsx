import * as Sentry from '@sentry/react';
import { FunctionComponent, PropsWithChildren, Suspense } from 'react';
import HvitBoks from './komponenter/hvitboks/HvitBoks';
import VerticalSpacer from './komponenter/VerticalSpacer';
import { Alert, BodyShort, Heading, Loader } from '@navikt/ds-react';

const ErrorOgSuspenseHandlerMain: FunctionComponent<PropsWithChildren> = (props) => (
    <Sentry.ErrorBoundary
        fallback={({ error, componentStack, resetError }) => (
            <>
                <Alert variant="warning" size="small">
                    <Heading size="small">Det har oppstått en uventet feil. Forsøk å laste siden på nytt.</Heading>
                    <VerticalSpacer rem={0.5} />
                    <BodyShort size="small">
                        Teknisk feilkode: <i>{error?.message}</i>
                    </BodyShort>
                </Alert>
            </>
        )}
    >
        <Suspense
            fallback={
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    <HvitBoks style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Loader type="XL" />
                    </HvitBoks>
                </div>
            }
        >
            {props.children}
        </Suspense>
    </Sentry.ErrorBoundary>
);

export default ErrorOgSuspenseHandlerMain;
