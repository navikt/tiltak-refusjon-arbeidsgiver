import { Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { korreksjonsgrunnTekst } from '../../messages';
import { formatterDato } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Korreksjon, Korreksjonsgrunn, KorreksjonStatus } from '../refusjon';
import { Alert } from '@navikt/ds-react';

type Props = {
    korreksjon: Korreksjon;
};

const KorreksjonInfo: FunctionComponent<Props> = (props) => {
    const Korreksjonsgrunner = () => (
        <>
            <Normaltekst>
                Saksbehandler har oppgitt følgende grunn{props.korreksjon.korreksjonsgrunner.length > 1 && 'er'} til
                denne korreksjonen
                <ul style={{ margin: '0.25rem' }}>
                    {props.korreksjon.korreksjonsgrunner.map((kg) => (
                        <li key={kg}>{korreksjonsgrunnTekst[kg]}</li>
                    ))}
                </ul>
            </Normaltekst>
        </>
    );

    switch (props.korreksjon.status) {
        case KorreksjonStatus.TILLEGSUTBETALING:
            return (
                <>
                    <Normaltekst>
                        Det er blitt foretatt en ny beregning av refusjonen for sommerjobb. Det tidligere utbetalte
                        beløpet er fratrukket i denne korrigerte beregningen. Det vil bli etterbetalt{' '}
                        <b>{formatterPenger(props.korreksjon.refusjonsgrunnlag.beregning?.refusjonsbeløp!)}</b>. Denne
                        korreksjonen ble registrert {formatterDato(props.korreksjon.godkjentTidspunkt!)}. Pengene vil
                        være på konto i løpet av 3-4 dager etter dette.
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <Korreksjonsgrunner />
                </>
            );
        case KorreksjonStatus.TILBAKEKREVING:
            return (
                <>
                    <Normaltekst>
                        Det er blitt foretatt en ny beregning av refusjonen for sommerjobb. Det tidligere utbetalte
                        beløpet er fratrukket i denne korrigerte beregningen. Den nye beregningen viser at det vil
                        kreves tilbake{' '}
                        <b>{formatterPenger(props.korreksjon.refusjonsgrunnlag.beregning?.refusjonsbeløp! * -1)}</b>.
                    </Normaltekst>
                    <Normaltekst> NAV vil ta kontakt for nærmere detaljer vedrørende tilbakekrevingen.</Normaltekst>
                    <VerticalSpacer rem={1} />
                    <Korreksjonsgrunner />
                </>
            );
        case KorreksjonStatus.OPPGJORT:
            return (
                <>
                    <Normaltekst>
                        Det er blitt foretatt en ny beregning av refusjonen for sommerjobb. Den nye beregningen viser at
                        det utbetalte beløpet er korrekt. Dette kan benyttes som en kvittering på at utbetalt beløp er
                        riktig
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <Korreksjonsgrunner />
                    {props.korreksjon.korreksjonsgrunner.find(
                        (g) => g === Korreksjonsgrunn.UTBETALT_HELE_TILSKUDDSBELØP
                    ) && (
                        <Alert variant="info" size="small">
                            Utbetalt hele tilskuddsbeløpet: utregningen viste feil refusjonsbeløp, hele tilskuddsbeløpet
                            ble utbetalt.
                        </Alert>
                    )}
                </>
            );
        default:
            return null;
    }
};

export default KorreksjonInfo;
