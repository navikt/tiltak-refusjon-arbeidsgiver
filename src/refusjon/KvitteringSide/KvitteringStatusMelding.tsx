import { Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { Status } from '../status';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

interface Props {
    status: Status;
}

const KvitteringStatusMelding: FunctionComponent<Props> = (props) => {
    switch (props.status) {
        case Status.UTBETALING_FEILET:
            return (
                <AlertStripeAdvarsel>
                    Vi har problemer med utbetalingen. Sjekk at kontonummeret oppgitt i avtalen er i bruk. Ta kontakt
                    med veileder for å få hjelp.
                </AlertStripeAdvarsel>
            );
        case Status.UTBETALT:
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
export default KvitteringStatusMelding;
