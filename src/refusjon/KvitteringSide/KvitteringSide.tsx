import React, { FunctionComponent, ReactElement } from 'react';
import { useParams } from 'react-router';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import Utregning from '../../komponenter/Utregning';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { statusTekst } from '../../messages';
import { RefusjonStatus } from '../../refusjon/status';
import { useHentRefusjon } from '../../services/rest-service';
import { formatterDato, NORSK_DATO_FORMAT, NORSK_DATO_OG_TID_FORMAT } from '../../utils/datoUtils';
import { storForbokstav } from '../../utils/stringUtils';
import { Refusjon } from '../refusjon';
import InformasjonFraAvtalen from '../RefusjonSide/informasjonAvtalen/InformasjonFraAvtalen';
import InntekterFraAMeldingen from '../RefusjonSide/inntektsmelding/InntekterFraAMeldingen';
import InntekterFraAMeldingenGammel from '../RefusjonSide/InntekterFraAMeldingenGammel';
import InntekterFraTiltaketSvar from '../RefusjonSide/InntekterFraTiltaketSvar';
import InntekterFraTiltaketSvarGammel from '../RefusjonSide/InntekterFraTiltaketSvarGammel';
import SummeringBoks from '../RefusjonSide/SummeringBoks';
import Statusmelding from './Statusmelding';
import LagreSomPdfKnapp from './LagreSomPdfKnapp';
import TidligereRefunderbarBeløpKvittering from '../RefusjonSide/TidligereRefunderbarBeløpKvittering';
import { Tag, Heading } from '@navikt/ds-react';

export const etikettForRefusjonStatus = (refusjon: Refusjon): ReactElement => {
    if (refusjon.status === RefusjonStatus.UTBETALING_FEILET) {
        return <Tag variant="error">{storForbokstav(statusTekst[refusjon.status])} </Tag>;
    } else if (refusjon.status === RefusjonStatus.SENDT_KRAV) {
        return (
            <Tag variant="info">
                {storForbokstav(statusTekst[refusjon.status])}{' '}
                {refusjon.godkjentAvArbeidsgiver &&
                    formatterDato(refusjon.godkjentAvArbeidsgiver, NORSK_DATO_OG_TID_FORMAT)}
            </Tag>
        );
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
    }
    return <Tag variant="info">{storForbokstav(statusTekst[refusjon.status])} </Tag>;
};
const KvitteringSide: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    if (!refusjon.refusjonsgrunnlag.inntektsgrunnlag) return null;

    return (
        <HvitBoks>
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
            <InformasjonFraAvtalen />
            <VerticalSpacer rem={2} />
            {refusjon.harTattStillingTilAlleInntektslinjer ? (
                <>
                    <InntekterFraAMeldingen kvitteringVisning={true} />
                    <VerticalSpacer rem={2} />
                    <InntekterFraTiltaketSvar refusjonsgrunnlag={refusjon.refusjonsgrunnlag} />
                    <TidligereRefunderbarBeløpKvittering refusjon={refusjon} />
                </>
            ) : (
                <>
                    <InntekterFraAMeldingenGammel />
                    <VerticalSpacer rem={2} />
                    <InntekterFraTiltaketSvarGammel refusjonsgrunnlag={refusjon.refusjonsgrunnlag} />
                    <TidligereRefunderbarBeløpKvittering refusjon={refusjon} />
                </>
            )}
            <VerticalSpacer rem={2} />
            <Utregning
                beregning={refusjon.refusjonsgrunnlag.beregning}
                tilskuddsgrunnlag={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag}
                forrigeRefusjonMinusBeløp={refusjon.refusjonsgrunnlag.forrigeRefusjonMinusBeløp}
            />
            <VerticalSpacer rem={4} />
            <SummeringBoks refusjonsgrunnlag={refusjon.refusjonsgrunnlag} status={refusjon.status} />
        </HvitBoks>
    );
};

export default KvitteringSide;
