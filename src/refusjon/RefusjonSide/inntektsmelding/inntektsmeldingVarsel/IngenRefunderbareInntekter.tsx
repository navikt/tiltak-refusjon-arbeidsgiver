import { Alert } from '@navikt/ds-react';
import React, { FunctionComponent } from 'react';

interface Props {
    ingenRefunderbareInntekter: boolean;
}

const IngenRefunderbareInntekter: FunctionComponent<Props> = ({ ingenRefunderbareInntekter }: Props) =>
    ingenRefunderbareInntekter ? (
        <div className={'inntektsmelding__varsel-linje'}>
            <Alert variant="warning" size="small">
                Vi kan ikke finne noen lønnsinntekter for denne perioden. Når a-meldingen er oppdatert vil
                inntektsopplysningene vises her automatisk.
            </Alert>
        </div>
    ) : null;

export default IngenRefunderbareInntekter;
