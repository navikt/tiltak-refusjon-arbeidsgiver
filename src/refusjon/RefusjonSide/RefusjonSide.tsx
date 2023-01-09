import React, { FunctionComponent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import { godkjennRefusjon, useHentRefusjon } from '../../services/rest-service';
import { innSendingRefusjon, UtbetaltStatus } from '../../utils/amplitude-utils';
import InformasjonFraAvtalen from './informasjonAvtalen/InformasjonFraAvtalen';
import InntekterFraAMeldingen from './inntektsmelding/InntekterFraAMeldingen';
import './RefusjonSide.less';
import RefusjonIngress from './RefusjonIngress';
import RefusjonInnsending from './refusjonInnsending/RefusjonInnsending';
import InntekterFraTiltaketSpørsmål from './InntekterFraTiltaketSpørsmål';
import TidligereRefunderbarBeløp from './TidligereRefunderbarBeløp';
import RefusjonGodjennModal from './RefusjonGodjennModal';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import Lenke from 'nav-frontend-lenker';

const RefusjonSide: FunctionComponent = () => {
    const navigate = useNavigate();
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const [visGodkjennModal, setVisGodkjennModal] = useState<boolean>(false);

    const godkjennRefusjonen = async (): Promise<void> => {
        try {
            await godkjennRefusjon(refusjon.id).then(() => {
                navigate({ pathname: `/refusjon/${refusjon.id}/kvittering`, search: window.location.search });
                innSendingRefusjon(UtbetaltStatus.OK, refusjon, undefined);
            });
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
                {refusjon.forrigeRefusjonSomSkalSendesFørst != null && (
                    <>
                        <AlertStripeAdvarsel>
                            <Lenke href={'/refusjon/' + refusjon.forrigeRefusjonSomSkalSendesFørst.id}>
                                <b>Refusjon:</b>{' '}
                                {
                                    refusjon.forrigeRefusjonSomSkalSendesFørst.refusjonsgrunnlag.tilskuddsgrunnlag
                                        .avtaleNr
                                }
                                -
                                {
                                    refusjon.forrigeRefusjonSomSkalSendesFørst.refusjonsgrunnlag.tilskuddsgrunnlag
                                        .løpenummer
                                }
                            </Lenke>{' '}
                            må sendes inn før du kan sende inn denne refusjonen:{' '}
                            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.avtaleNr +
                                '-' +
                                refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.løpenummer}
                            .
                        </AlertStripeAdvarsel>
                        <VerticalSpacer rem={1} />
                    </>
                )}
                <InformasjonFraAvtalen />
                {!refusjon.forrigeRefusjonSomSkalSendesFørst && (
                    <>
                        <InntekterFraAMeldingen kvitteringVisning={false} />
                        <InntekterFraTiltaketSpørsmål />
                        <TidligereRefunderbarBeløp refusjon={refusjon} />
                        <RefusjonInnsending refusjon={refusjon} setVisGodkjennModal={setVisGodkjennModal} />
                    </>
                )}
            </HvitBoks>
            <RefusjonGodjennModal
                refusjon={refusjon}
                visGodkjennModal={visGodkjennModal}
                setVisGodkjennModal={setVisGodkjennModal}
                godkjennRefusjonen={godkjennRefusjonen}
            />
        </>
    );
};

export default RefusjonSide;
