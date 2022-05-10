import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import React, { FunctionComponent } from 'react';

interface Props {
    ingenRefunderbareInntekter: boolean;
}

const IngenRefunderbareInntekter: FunctionComponent<Props> = ({ ingenRefunderbareInntekter }: Props) =>
    ingenRefunderbareInntekter ? (
        <div className={'inntektsmelding__varsel-linje'}>
            <AlertStripeAdvarsel>
                Vi kan ikke finne noen lønnsinntekter for denne perioden. Når a-meldingen er oppdatert vil
                inntektsopplysningene vises her automatisk.
            </AlertStripeAdvarsel>
        </div>
    ) : null;

export default IngenRefunderbareInntekter;
