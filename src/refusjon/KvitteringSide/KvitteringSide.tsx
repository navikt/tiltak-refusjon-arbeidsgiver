import { Innholdstittel } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { useHentRefusjon } from '../../services/rest-service';
import InformasjonFraAvtalen from '../RefusjonSide/InformasjonFraAvtalen';
import SummeringBoks from '../RefusjonSide/SummeringBoks';
import Utregning from '../../komponenter/Utregning';
import InntekterFraAMeldingen from '../RefusjonSide/InntekterFraAMeldingen';
import InntekterFraTiltaketSvar from '../RefusjonSide/InntekterFraTiltaketSvar';
import Statusmelding from './Statusmelding';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { EtikettAdvarsel } from 'nav-frontend-etiketter';
import { storForbokstav } from '../../utils/stringUtils';
import { statusTekst } from '../../messages';
import { Status } from '../../refusjon/status';
import { Refusjon } from '../refusjon';
import { ReactElement } from 'react';
import { formatterDato } from '../../utils/datoUtils';
import { NORSK_DATO_OG_TID_FORMAT } from '../../utils/datoUtils';

const etikettForRefusjonStatus = (refusjon: Refusjon): ReactElement => {
    if (refusjon.status === Status.UTBETALING_FEILET) {
        return <EtikettAdvarsel>{storForbokstav(statusTekst[refusjon.status])} </EtikettAdvarsel>;
    }
    return (
        <EtikettInfo>
            {storForbokstav(statusTekst[refusjon.status])}{' '}
            {refusjon.godkjentAvArbeidsgiver &&
                formatterDato(refusjon.godkjentAvArbeidsgiver, NORSK_DATO_OG_TID_FORMAT)}
        </EtikettInfo>
    );
};
const KvitteringSide: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    if (!refusjon.inntektsgrunnlag) return null;

    return (
        <HvitBoks>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Innholdstittel role="heading">Kvittering for refusjon</Innholdstittel>
                {etikettForRefusjonStatus(refusjon)}
            </div>
            <VerticalSpacer rem={1} />
            <Statusmelding status={refusjon.status} />
            <VerticalSpacer rem={2} />
            <InformasjonFraAvtalen />
            <VerticalSpacer rem={2} />
            <InntekterFraAMeldingen />
            <VerticalSpacer rem={2} />
            <InntekterFraTiltaketSvar />
            <VerticalSpacer rem={2} />
            <Utregning beregning={refusjon.beregning} tilskuddsgrunnlag={refusjon.tilskuddsgrunnlag} />
            <VerticalSpacer rem={4} />
            <SummeringBoks />
        </HvitBoks>
    );
};

export default KvitteringSide;
