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
import GodkjennModal from './GodkjennModal';
import NokkelInfo from './NokkelInfo';
import './RefusjonSide.less';
import SummeringBoks from './SummeringBoks';

const cls = BEMHelper('refusjonside');

const RefusjonSide: FunctionComponent = () => {
    const history = useHistory();
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const [bekrefetKorrekteOpplysninger, setBekrefetKorrekteOpplysninger] = useState(false);
    const [ikkeBekreftetFeilmelding, seTikkeBekreftetFeilmelding] = useState('');
    const [visGodkjennModal, setVisGodkjennModal] = useState(false);

    const bekreftOpplysninger = () => {
        setBekrefetKorrekteOpplysninger(!bekrefetKorrekteOpplysninger);
        seTikkeBekreftetFeilmelding('');
    };
    const fullførRefusjon = async () => {
        if (bekrefetKorrekteOpplysninger) {
            setVisGodkjennModal(true);
            // try {
            //     await godkjennRefusjon(refusjonId);
            //     history.push({ pathname: `/refusjon/${refusjon.id}/kvittering`, search: window.location.search });
            //     innSendingRefusjon(UtbetaltStatus.OK, refusjon, undefined);
            // } catch (error) {
            //     console.log('feil ved innsending:', error);
            //     innSendingRefusjon(UtbetaltStatus.FEILET, refusjon, error);
            //     throw error;
            // }
        } else {
            seTikkeBekreftetFeilmelding('Du må samtykke at opplysningene er riktig, før du kan sende inn skjemaet.');
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
                <NokkelInfo />
                <VerticalSpacer rem={2} />
                <Utregning refusjon={refusjon} />
                <VerticalSpacer rem={4} />
                {refusjon.beregning && refusjon.beregning.refusjonsbeløp > 0 && (
                    <>
                        <SummeringBoks />

                        <VerticalSpacer rem={1} />

                        <BekreftCheckboksPanel
                            className={cls.element('bekrefthandling')}
                            onChange={() => bekreftOpplysninger()}
                            checked={bekrefetKorrekteOpplysninger}
                            label="Jeg bekrefter at opplysningene er korrekte."
                            feil={ikkeBekreftetFeilmelding}
                        />
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
            />
        </>
    );
};

export default RefusjonSide;
