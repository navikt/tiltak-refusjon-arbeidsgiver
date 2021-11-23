import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { RefusjonStatus } from '../status';

interface Props {
    status: RefusjonStatus;
}

const Statusmelding: FunctionComponent<Props> = (props) => {
    switch (props.status) {
        case RefusjonStatus.UTBETALING_FEILET:
            return (
                <AlertStripeAdvarsel>
                    Vi har problemer med utbetalingen. Sjekk at kontonummeret oppgitt i avtalen er i bruk. Ta kontakt
                    med veileder for å få hjelp.
                </AlertStripeAdvarsel>
            );
        case RefusjonStatus.UTBETALT:
            return (
                <Normaltekst>
                    Refusjonskravet er utbetalt. Det vil ta 3–4 dager før pengene kommer på kontoen.
                </Normaltekst>
            );
        default:
            return (
                <Normaltekst>
                    Refusjonskravet er nå sendt. Det vil ta 3–4 dager før pengene kommer på kontoen. Denne refusjonen
                    vil bli tatt vare på under “Sendt krav”.
                </Normaltekst>
            );
    }
};
export default Statusmelding;
