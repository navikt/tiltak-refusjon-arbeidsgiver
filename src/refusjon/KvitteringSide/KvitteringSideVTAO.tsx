import { Heading, Tag } from '@navikt/ds-react';
import { FunctionComponent, ReactElement } from 'react';
import Utregning from '../../komponenter/Utregning';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { statusTekst } from '../../messages';
import { RefusjonStatus } from '../status';
import { NORSK_DATO_FORMAT, NORSK_DATO_OG_TID_FORMAT, formatterDato } from '../../utils/datoUtils';
import { storForbokstav } from '../../utils/stringUtils';
import InntekterFraAMeldingenGammel from '../RefusjonSide/InntekterFraAMeldingenGammel';
import InntekterFraTiltaketSvar from '../RefusjonSide/InntekterFraTiltaketSvar';
import InntekterFraTiltaketSvarGammel from '../RefusjonSide/InntekterFraTiltaketSvarGammel';
import SummeringBoks from '../RefusjonSide/SummeringBoks';
import TidligereRefunderbarBeløpKvittering from '../RefusjonSide/TidligereRefunderbarBeløpKvittering';
import InformasjonFraAvtalen from '../RefusjonSide/informasjonAvtalen/InformasjonFraAvtalen';
import InntekterFraAMeldingen from '../RefusjonSide/inntektsmelding/InntekterFraAMeldingen';
import { Refusjon } from '../refusjon';
import LagreSomPdfKnapp from './LagreSomPdfKnapp';
import Statusmelding from './Statusmelding';
import SummeringBoksNullbeløp from '../RefusjonSide/SummeringsBoksNullbeløp';
import Boks from '../../komponenter/Boks/Boks';

export const etikettForRefusjonStatus = (refusjon: Refusjon): ReactElement => {
    if (refusjon.status === RefusjonStatus.UTBETALING_FEILET) {
        return <Tag variant="error">{storForbokstav(statusTekst[refusjon.status])} </Tag>;
    } else if (refusjon.status === RefusjonStatus.UTBETALT) {
        return (
            <Tag variant="info">
                {storForbokstav(statusTekst[RefusjonStatus.SENDT_KRAV])}{' '}
                {refusjon.godkjentAvArbeidsgiver && formatterDato(refusjon.godkjentAvArbeidsgiver, NORSK_DATO_FORMAT)}
                {', '}
                {storForbokstav(statusTekst[refusjon.status])}{' '}
                {refusjon.utbetaltTidspunkt && formatterDato(refusjon.utbetaltTidspunkt, NORSK_DATO_FORMAT)}
            </Tag>
        );
    } else {
        return (
            <Tag variant="info">
                {storForbokstav(statusTekst[refusjon.status])}{' '}
                {refusjon.godkjentAvArbeidsgiver &&
                    formatterDato(refusjon.godkjentAvArbeidsgiver, NORSK_DATO_OG_TID_FORMAT)}
            </Tag>
        );
    }
};

type Props = {
    refusjon: Refusjon;
};

const KvitteringSideVTAO: FunctionComponent<Props> = ({ refusjon }) => {
    if (!refusjon.refusjonsgrunnlag.inntektsgrunnlag) return null;

    return (
        <Boks variant="hvit">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading size="large" role="heading">
                    Kvittering for refusjon
                </Heading>
                {etikettForRefusjonStatus(refusjon)}
            </div>
            <VerticalSpacer rem={1} />
            <div style={{ display: 'flex' }}>
                <Statusmelding status={refusjon.status} />
                <div style={{ marginLeft: '5rem' }}>
                    <LagreSomPdfKnapp avtaleId={refusjon.id} />
                </div>
            </div>

            <VerticalSpacer rem={2} />
            <InformasjonFraAvtalen refusjon={refusjon} />
            <VerticalSpacer rem={2} />
            <SummeringBoks
                erForKorreksjon={false}
                refusjonsgrunnlag={refusjon.refusjonsgrunnlag}
                status={refusjon.status}
            />
        </Boks>
    );
};

export default KvitteringSideVTAO;
