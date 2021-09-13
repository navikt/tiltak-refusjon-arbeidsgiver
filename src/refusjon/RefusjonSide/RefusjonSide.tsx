import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import EksternLenke from '../../komponenter/EksternLenke/EksternLenke';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import LagreKnapp from '../../komponenter/LagreKnapp';
import Utregning from '../../komponenter/Utregning';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { godkjennRefusjon, useHentRefusjon } from '../../services/rest-service';
import { innSendingRefusjon, UtbetaltStatus } from '../../utils/amplitude-utils';
import BEMHelper from '../../utils/bem';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import GodkjennModal from './GodkjennModal';
import InformasjonFraAvtalen from './InformasjonFraAvtalen';
import InntekterFraAMeldingen from './InntekterFraAMeldingen';
import InntekterFraTiltaketSpørsmål from './InntekterFraTiltaketSpørsmål';
import './RefusjonSide.less';
import SummeringBoks from './SummeringBoks';

const cls = BEMHelper('refusjonside');

const RefusjonSide: FunctionComponent = () => {
    const history = useHistory();
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const [bekrefetKorrekteOpplysninger, setBekrefetKorrekteOpplysninger] = useState(false);
    const [ikkeBekreftetFeilmelding, setIkkeBekreftetFeilmelding] = useState('');
    const [visGodkjennModal, setVisGodkjennModal] = useState(false);

    const bekreftOpplysninger = () => {
        setBekrefetKorrekteOpplysninger(!bekrefetKorrekteOpplysninger);
        setIkkeBekreftetFeilmelding('');
    };
    const fullførRefusjon = async () => {
        if (bekrefetKorrekteOpplysninger) {
            setVisGodkjennModal(true);
        } else {
            setIkkeBekreftetFeilmelding('Du må samtykke at opplysningene er riktig, før du kan sende inn skjemaet.');
        }
    };

    const godkjennRefusjonen = async () => {
        try {
            await godkjennRefusjon(refusjonId);
            history.push({ pathname: `/refusjon/${refusjon.id}/kvittering`, search: window.location.search });
            innSendingRefusjon(UtbetaltStatus.OK, refusjon, undefined);
        } catch (error) {
            console.log('feil ved innsending:', error);
            innSendingRefusjon(UtbetaltStatus.FEILET, refusjon, error);
            throw error;
        }
    };

    return (
        <>
            <HvitBoks>
                <VerticalSpacer rem={2} />
                <Innholdstittel role="heading">Beregning av refusjon</Innholdstittel>
                <VerticalSpacer rem={1} />
                <Normaltekst>
                    Vi henter inntektsopplysninger for deltakeren fra a-meldingen automatisk. A-meldingen er en månedlig
                    melding fra arbeidsgiver til NAV, SSB og Skatteetaten om ansattes inntekt, arbeidsforhold og
                    forskuddstrekk, samt arbeidsgiveravgift og finansskatt for virksomheten. Hvis inntektsopplysningene
                    ikke stemmer så må det{' '}
                    <EksternLenke href={'https://www.altinn.no/skjemaoversikt/a-ordningen/a-melding2/'}>
                        oppdateres i ditt lønnssystem.
                    </EksternLenke>
                    Feriepenger, innskudd obligatorisk tjenestepensjon, arbeidsgiveravgiften og lønnstilskuddsprosenten
                    er hentet fra avtalen om midlertidig lønnstilskudd.
                </Normaltekst>
                <VerticalSpacer rem={2} />
                <InformasjonFraAvtalen />
                <VerticalSpacer rem={2} />
                <InntekterFraAMeldingen />
                <VerticalSpacer rem={2} />
                {refusjon.inntektsgrunnlag?.inntekter?.find((inntekt) => inntekt.erMedIInntektsgrunnlag) && (
                    <InntekterFraTiltaketSpørsmål />
                )}
                <VerticalSpacer rem={2} />
                {refusjon.beregning &&
                    refusjon.beregning.refusjonsbeløp > 0 &&
                    refusjon.inntekterKunFraTiltaket !== null && (
                        <>
                            <Utregning beregning={refusjon.beregning} tilskuddsgrunnlag={refusjon.tilskuddsgrunnlag} />
                            <VerticalSpacer rem={4} />
                            <SummeringBoks />

                            <VerticalSpacer rem={1} />

                            <BekreftCheckboksPanel
                                onChange={() => bekreftOpplysninger()}
                                checked={bekrefetKorrekteOpplysninger}
                                label="Jeg bekrefter at opplysningene er korrekte."
                                feil={ikkeBekreftetFeilmelding}
                            >
                                NAV og Riksrevisjonen kan iverksette kontroll (for eksempel stikkprøvekontroll) med at
                                midlene nyttes etter forutsetningene, jfr. Bevilgningsreglementet av 26.05.2005 § 10, 2.
                                ledd
                            </BekreftCheckboksPanel>
                            <VerticalSpacer rem={2} />
                            <LagreKnapp type="hoved" lagreFunksjon={() => fullførRefusjon()}>
                                Fullfør
                            </LagreKnapp>
                        </>
                    )}
            </HvitBoks>
            <GodkjennModal
                isOpen={visGodkjennModal}
                lukkModal={() => setVisGodkjennModal(false)}
                godkjenn={godkjennRefusjonen}
                tittel="Send inn refusjon"
            >
                <Normaltekst>
                    Du søker nå om refusjon for hele den avtalte perioden{' '}
                    <b>
                        {formatterPeriode(
                            refusjon.tilskuddsgrunnlag.tilskuddFom,
                            refusjon.tilskuddsgrunnlag.tilskuddTom
                        )}
                        . Dette kan du kun gjøre en gang.
                    </b>{' '}
                    Sikre deg derfor at alle inntekter innenfor perioden er rapportert inn og at refusjonsbeløpet
                    stemmer.
                </Normaltekst>
                <VerticalSpacer rem={1} />
                <Normaltekst>
                    Hvis refusjonsbeløpet på <b>{formatterPenger(refusjon.beregning?.refusjonsbeløp!)}</b> ikke stemmer,
                    ta kontakt med veileder før du klikker Send inn.
                </Normaltekst>
            </GodkjennModal>
        </>
    );
};

export default RefusjonSide;
