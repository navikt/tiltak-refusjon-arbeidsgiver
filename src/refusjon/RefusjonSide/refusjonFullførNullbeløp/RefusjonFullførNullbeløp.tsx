
import { FunctionComponent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { godkjennRefusjonMedNullbeløp, useHentRefusjon } from '../../../services/rest-service';
import BEMHelper from '../../../utils/bem';
import LagreKnapp from '../../../komponenter/LagreKnapp';
import RefusjonFullførNullbeløpModal from './RefusjonFullførNullbeløpModal';
import { UtbetaltStatus, innSendingRefusjon } from '../../../utils/amplitude-utils';
import './refusjonFullførNullbeløp.less';


const RefusjonFullførNullbeløp: FunctionComponent = () => {
    const [visRefusjonFullførNullbeløpModal, setVisRefusjonFullførNullbeløpModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const cls = BEMHelper('refusjonFullforNullbelop');
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);

    const fullførRefusjon = async (): Promise<void> => {
        return setVisRefusjonFullførNullbeløpModal(true);
    };

    const godkjennRefusjonen = async (): Promise<void> => {
        try {
            await godkjennRefusjonMedNullbeløp(refusjon.id).then(() => {
                navigate({ pathname: `/refusjon/${refusjon.id}/kvittering`, search: window.location.search });
                innSendingRefusjon(UtbetaltStatus.OK, refusjon, undefined);
            });
        } catch (error: any) {
            console.log('feil ved innsending:', error);
            innSendingRefusjon(UtbetaltStatus.FEILET, refusjon, error);
            throw error;
        }
    };

    const harFerietrekkIPerioden = refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter.find((i) => {
        if(i.måned) {
            const periode = Number(i.måned.slice(-2))
            return (i.beskrivelse === 'trekkILoennForFerie' && periode === new Date().getMonth())
        }
        return false;
    })

    if(harFerietrekkIPerioden || refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter.find((i) => i.erOpptjentIPeriode === true)) {
        return null;
    }

    if(harFerietrekkIPerioden || refusjon.refusjonsgrunnlag.beregning) {
        return null;
    }

    return (
        <div className={cls.className}>
            <LagreKnapp variant="primary" lagreFunksjon={() => fullførRefusjon()}>
                Fullfør med nullbeløp
            </LagreKnapp>
            <RefusjonFullførNullbeløpModal 
                refusjon={refusjon}
                visGodkjennModal={visRefusjonFullførNullbeløpModal}
                setVisGodkjennModal={setVisRefusjonFullførNullbeløpModal}
                godkjennRefusjonen={godkjennRefusjonen}/>
        </div>
        
    )
}

export default RefusjonFullførNullbeløp;
