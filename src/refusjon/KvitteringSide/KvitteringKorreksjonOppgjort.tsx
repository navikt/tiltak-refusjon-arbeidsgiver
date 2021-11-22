import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import Utregning from '../../komponenter/Utregning';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { korreksjonsgrunnTekst, statusTekst } from '../../messages';
import { useHentRefusjon } from '../../services/rest-service';
import { formatterDato } from '../../utils/datoUtils';
import { storForbokstav } from '../../utils/stringUtils';
import { Korreksjonsgrunn } from '../refusjon';
import InformasjonFraAvtalen from '../RefusjonSide/InformasjonFraAvtalen';
import InntekterFraAMeldingen from '../RefusjonSide/InntekterFraAMeldingen';
import InntekterFraTiltaketSvar from '../RefusjonSide/InntekterFraTiltaketSvar';

const KvitteringKorreksjonOppgjort: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);

    return (
        <HvitBoks>
            <VerticalSpacer rem={2} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Innholdstittel>Oppgjør av refusjon</Innholdstittel>
                <EtikettInfo>
                    {storForbokstav(statusTekst[refusjon.status])}{' '}
                    {refusjon.godkjentAvSaksbehandler && formatterDato(refusjon.godkjentAvSaksbehandler)}
                </EtikettInfo>
            </div>
            <VerticalSpacer rem={1} />
            <Normaltekst>
                Det er blitt foretatt en ny beregning av refusjonen for sommerjobb. Den nye beregningen viser at det
                utbetalte beløpet er korrekt. Dette kan benyttes som en kvittering på at utbetalt beløp er riktig
            </Normaltekst>
            <VerticalSpacer rem={1} />
            <Normaltekst>
                Saksbehandler har oppgitt følgende grunn{refusjon.korreksjonsgrunner.length > 1 && 'er'} til denne
                korreksjonen
                <ul style={{ margin: '0.25rem' }}>
                    {refusjon.korreksjonsgrunner.map((kg) => (
                        <li key={kg}>{korreksjonsgrunnTekst[kg]}</li>
                    ))}
                </ul>
                <VerticalSpacer rem={1} />
                <Link to={{ pathname: `/refusjon/${refusjon.korreksjonAvId}`, search: window.location.search }}>
                    Klikk her for å åpne refusjonen som korrigeres.
                </Link>
            </Normaltekst>
            {refusjon.korreksjonsgrunner.find((g) => g === Korreksjonsgrunn.UTBETALT_HELE_TILSKUDDSBELØP) && (
                <AlertStripeInfo>
                    Utbetalt hele tilskuddsbeløpet: utregningen viste feil refusjonsbeløp, hele tilskuddsbeløpet ble
                    utbetalt.
                </AlertStripeInfo>
            )}
            <VerticalSpacer rem={2} />
            <InformasjonFraAvtalen />
            <VerticalSpacer rem={2} />
            <InntekterFraAMeldingen />
            <VerticalSpacer rem={2} />
            <InntekterFraTiltaketSvar />
            <VerticalSpacer rem={2} />
            <Utregning beregning={refusjon.beregning} tilskuddsgrunnlag={refusjon.tilskuddsgrunnlag} />
            <VerticalSpacer rem={4} />
        </HvitBoks>
    );
};

export default KvitteringKorreksjonOppgjort;