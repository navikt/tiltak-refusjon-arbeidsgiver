import React, { FunctionComponent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import { godkjennRefusjon, useHentRefusjon } from '../../services/rest-service';
import { innSendingRefusjon, UtbetaltStatus } from '../../utils/amplitude-utils';
import InformasjonFraAvtalen from './informasjonAvtalen/InformasjonFraAvtalen';
import InntekterFraAMeldingen from './inntektsmelding/InntekterFraAMeldingen';
import RefusjonIngress from './RefusjonIngress';
import RefusjonInnsending from './refusjonInnsending/RefusjonInnsending';
import InntekterFraTiltaketSpørsmål from './InntekterFraTiltaketSpørsmål';
import TidligereRefunderbarBeløp from './TidligereRefunderbarBeløp';
import RefusjonGodjennModal from './RefusjonGodjennModal';
import RefusjonFullførNullbeløp from './refusjonFullførNullbeløp/RefusjonFullførNullbeløp';
import './RefusjonSide.less';

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

    console.log('Hvor mange ganger rendres denne da tro?');

    return (
        <>
            <HvitBoks>
                <RefusjonIngress refusjon={refusjon} />
                <InformasjonFraAvtalen />
                <InntekterFraAMeldingen kvitteringVisning={false} />
                <RefusjonFullførNullbeløp />
                <InntekterFraTiltaketSpørsmål />
                <TidligereRefunderbarBeløp refusjon={refusjon} />
                <RefusjonInnsending refusjon={refusjon} setVisGodkjennModal={setVisGodkjennModal} />
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
