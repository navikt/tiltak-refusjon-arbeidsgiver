import * as Sentry from '@sentry/react';
import { FunctionComponent, PropsWithChildren, Suspense } from 'react';
import VerticalSpacer from './komponenter/VerticalSpacer';
import { Alert, BodyShort, Heading, Loader } from '@navikt/ds-react';
import Boks from './komponenter/Boks/Boks';

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
                    <Boks variant="hvit" styling={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Loader type="XL" />
                    </Boks>
                </div>
            }
        >
            {props.children}
        </Suspense>
    </Sentry.ErrorBoundary>
);

export default ErrorOgSuspenseHandlerMain;
