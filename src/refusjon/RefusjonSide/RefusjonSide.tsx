import { Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { godkjennRefusjon, useHentRefusjon } from '../../services/rest-service';
import { innSendingRefusjon, UtbetaltStatus } from '../../utils/amplitude-utils';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import GodkjennModal from './GodkjennModal';
import InformasjonFraAvtalen from './InformasjonFraAvtalen';
import InntekterFraAMeldingen from './InntekterFraAMeldingen';
import './RefusjonSide.less';
import RefusjonIngress from './RefusjonIngress';
import RefusjonInnsending from './RefusjonInnsending';
import InntekterFraTiltaketSpørsmål from './InntekterFraTiltaketSpørsmål';
import FratrekkSykepenger from './FratrekkSykepenger';

const RefusjonSide: FunctionComponent = () => {
    const navigate = useNavigate();
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const [visGodkjennModal, setVisGodkjennModal] = useState<boolean>(false);

    const godkjennRefusjonen = async (): Promise<void> => {
        try {
            await godkjennRefusjon(refusjonId!);
            navigate({ pathname: `/refusjon/${refusjon.id}/kvittering`, search: window.location.search });
            innSendingRefusjon(UtbetaltStatus.OK, refusjon, undefined);
        } catch (error: any) {
            console.log('feil ved innsending:', error);
            innSendingRefusjon(UtbetaltStatus.FEILET, refusjon, error);
            throw error;
        }
    };

    return (
        <>
            <HvitBoks>
                <RefusjonIngress refusjon={refusjon} />
                <InformasjonFraAvtalen />
                <VerticalSpacer rem={2} />
                <InntekterFraAMeldingen kvitteringVisning={false} />
                <InntekterFraTiltaketSpørsmål />
                <FratrekkSykepenger refusjon={refusjon} />
                <RefusjonInnsending refusjon={refusjon} setVisGodkjennModal={setVisGodkjennModal} />
            </HvitBoks>
            {refusjon.harTattStillingTilAlleInntektslinjer && (
                <>
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
                                    refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                                    refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                                )}
                                . Dette kan du kun gjøre en gang.
                            </b>{' '}
                            Sikre deg derfor at alle inntekter innenfor perioden er rapportert inn og at
                            refusjonsbeløpet stemmer.
                        </Normaltekst>
                        <VerticalSpacer rem={1} />
                        <Normaltekst>
                            Hvis refusjonsbeløpet på{' '}
                            <b>{formatterPenger(refusjon.refusjonsgrunnlag.beregning?.refusjonsbeløp!)}</b> ikke
                            stemmer, ta kontakt med veileder før du klikker Send inn.
                        </Normaltekst>
                    </GodkjennModal>
                </>
            )}
        </>
    );
};

export default RefusjonSide;
