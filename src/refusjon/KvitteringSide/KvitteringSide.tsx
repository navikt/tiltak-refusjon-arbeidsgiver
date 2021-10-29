import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
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
import { Status } from '../status';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import KvitteringStatusMelding from './KvitteringStatusMelding';

const KvitteringSide: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    if (!refusjon.inntektsgrunnlag) return null;

    return (
        <HvitBoks>
            <VerticalSpacer rem={2} />
            <Innholdstittel role="heading">Kvittering for refusjon</Innholdstittel>
            <VerticalSpacer rem={1} />
            <KvitteringStatusMelding status={refusjon.status} />
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
