import React, { FunctionComponent } from 'react';
import { RefusjonStatus } from '../status';
import { Alert, BodyShort } from '@navikt/ds-react';

interface Props {
    status: RefusjonStatus;
}

const Statusmelding: FunctionComponent<Props> = (props) => {
    switch (props.status) {
        case RefusjonStatus.UTBETALING_FEILET:
            return (
                <Alert variant="warning" size="small">
                    Vi har problemer med utbetalingen. Sjekk at kontonummeret oppgitt i avtalen er i bruk. Ta kontakt
                    med veileder for å få hjelp.
                </Alert>
            );
        case RefusjonStatus.UTBETALT:
            return (
                <BodyShort size="small">
                    Refusjonskravet er utbetalt. Det vil ta 3–4 dager før pengene kommer på kontoen.
                </BodyShort>
            );
        case RefusjonStatus.GODKJENT_MINUSBELØP:
        case RefusjonStatus.GODKJENT_NULLBELØP:
            return (
                <BodyShort size="small">
                    Refusjonskravet er godkjent. Denne refusjonen vil bli tatt vare på i oversikten.
                </BodyShort>
            );
        default:
            return (
                <BodyShort size="small">
                    Refusjonskravet er nå sendt. Det vil ta 3–4 dager før pengene kommer på kontoen. Denne refusjonen
                    vil bli tatt vare på under “Sendt krav”.
                </BodyShort>
            );
    }
};
export default Statusmelding;
