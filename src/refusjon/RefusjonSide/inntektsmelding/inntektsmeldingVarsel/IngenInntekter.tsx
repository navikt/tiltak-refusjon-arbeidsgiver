import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import React, { FunctionComponent } from 'react';

interface Props {
    ingenInntekter: boolean;
}

const IngenInntekter: FunctionComponent<Props> = ({ ingenInntekter }: Props) =>
    ingenInntekter ? (
        <div className={'inntektsmelding__varsel-linje'}>
            <AlertStripeAdvarsel>
                Vi kan ikke finne inntekter fra a-meldingen for denne perioden. Når a-meldingen er oppdatert vil
                inntektsopplysningene vises her automatisk.
            </AlertStripeAdvarsel>
        </div>
    ) : null;

export default IngenInntekter;
