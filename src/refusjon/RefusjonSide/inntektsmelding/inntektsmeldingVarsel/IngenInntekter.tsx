import React, { FunctionComponent } from 'react';
import { Alert } from '@navikt/ds-react';

interface Props {
    ingenInntekter: boolean;
}

const IngenInntekter: FunctionComponent<Props> = ({ ingenInntekter }: Props) =>
    ingenInntekter ? (
        <div className={'inntektsmelding__varsel-linje'}>
            <Alert variant="warning" size="small">
                Vi kan ikke finne inntekter fra a-meldingen for denne perioden. Når a-meldingen er oppdatert vil
                inntektsopplysningene vises her automatisk.
            </Alert>
        </div>
    ) : null;

export default IngenInntekter;
