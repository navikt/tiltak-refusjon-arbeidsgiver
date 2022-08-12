import { FunctionComponent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import { godkjennRefusjon, useHentRefusjon } from '../../services/rest-service';
import { innSendingRefusjon, UtbetaltStatus } from '../../utils/amplitude-utils';
import InformasjonFraAvtalen from './informasjonAvtalen/InformasjonFraAvtalen';
import InntekterFraTiltaketSpørsmål from './InntekterFraTiltaketSpørsmål';
import InntekterFraAMeldingen from './inntektsmelding/InntekterFraAMeldingen';
import RefusjonGodjennModal from './RefusjonGodjennModal';
import RefusjonIngress from './RefusjonIngress';
import RefusjonInnsending from './refusjonInnsending/RefusjonInnsending';
import RefusjonMinusBelop from './RefusjonMinusBelop';
import './RefusjonSide.less';
import TidligereRefunderbarBeløp from './TidligereRefunderbarBeløp';

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

    const lønnFratrukketFerieNegativt =
        refusjon.refusjonsgrunnlag.beregning?.lønnFratrukketFerie !== undefined &&
        refusjon.refusjonsgrunnlag.beregning?.lønnFratrukketFerie < 0;

    return (
        <>
            <HvitBoks>
                <RefusjonIngress refusjon={refusjon} />
                <InformasjonFraAvtalen />
                <InntekterFraAMeldingen kvitteringVisning={false} />
                <InntekterFraTiltaketSpørsmål />
                <TidligereRefunderbarBeløp refusjon={refusjon} />

                {!lønnFratrukketFerieNegativt && (
                    <RefusjonInnsending refusjon={refusjon} setVisGodkjennModal={setVisGodkjennModal} />
                )}
                {lønnFratrukketFerieNegativt && <RefusjonMinusBelop refusjon={refusjon} />}
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
