import React, { FunctionComponent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { godkjennRefusjon, useHentRefusjon } from '../../services/rest-service';
import { innSendingRefusjon, UtbetaltStatus } from '../../utils/amplitude-utils';
import InformasjonFraAvtalen from './informasjonAvtalen/InformasjonFraAvtalen';
import InntekterFraAMeldingen from './inntektsmelding/InntekterFraAMeldingen';
import RefusjonIngress from './RefusjonIngress';
import RefusjonInnsending from './refusjonInnsending/RefusjonInnsending';
import InntekterFraTiltaketSpørsmål from './InntekterFraTiltaketSpørsmål';
import TidligereRefunderbarBeløp from './TidligereRefunderbarBeløp';
import RefusjonGodkjennModal from './RefusjonGodkjennModal';
import RefusjonFullførNullbeløp from './refusjonFullførNullbeløp/RefusjonFullførNullbeløp';
import './RefusjonSide.less';
import Boks from '../../komponenter/Boks/Boks';
import RefusjonVTAOInnsending from './refusjonInnsending/RefusjonVTAOInnsending';
import RefusjonIngressVTAO from './RefusjonIngressVTAO';
import InformasjonFraAvtalenVTAO from './informasjonAvtalen/InformasjonFraAvtalenVTAO';

const RefusjonSide: FunctionComponent = () => {
    const navigate = useNavigate();
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const [visGodkjennModal, setVisGodkjennModal] = useState<boolean>(false);
    const [visRefusjonInnsending, setVisRefusjonInnsending] = useState<boolean>(true);

    const godkjennRefusjonen = async (): Promise<void> => {
        try {
            await godkjennRefusjon(refusjon.id, refusjon.sistEndret).then(() => {
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
        <div role="main">
            <Boks variant="hvit">
                {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype != 'VTAO' ? (
                    <>
                        <RefusjonIngress refusjon={refusjon} />
                        <InformasjonFraAvtalen refusjon={refusjon} />
                        <InntekterFraAMeldingen refusjon={refusjon} kvitteringVisning={false} />
                        <RefusjonFullførNullbeløp />
                        <InntekterFraTiltaketSpørsmål setVisRefusjonInnsending={setVisRefusjonInnsending} />
                        <TidligereRefunderbarBeløp refusjon={refusjon} />
                        {visRefusjonInnsending && (
                            <RefusjonInnsending refusjon={refusjon} setVisGodkjennModal={setVisGodkjennModal} />
                        )}
                    </>
                ) : (
                    <>
                        <RefusjonIngressVTAO refusjon={refusjon} />
                        <InformasjonFraAvtalenVTAO refusjon={refusjon} />
                        <RefusjonVTAOInnsending refusjon={refusjon} setVisGodkjennModal={setVisGodkjennModal} />
                    </>
                )}
            </Boks>
            <RefusjonGodkjennModal
                refusjon={refusjon}
                visGodkjennModal={visGodkjennModal}
                setVisGodkjennModal={setVisGodkjennModal}
                godkjennRefusjonen={godkjennRefusjonen}
            />
        </div>
    );
};

export default RefusjonSide;
