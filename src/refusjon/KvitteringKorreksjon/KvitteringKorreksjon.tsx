import { ExpansionCard, Heading, Tag } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import Utregning from '../../komponenter/Utregning';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import { korreksjonStatusTekst } from '../../messages';
import { useHentKorreksjon, useHentRefusjon } from '../../services/rest-service';
import { NORSK_DATO_OG_TID_FORMAT, formatterDato } from '../../utils/datoUtils';
import { storForbokstav } from '../../utils/stringUtils';
import InntekterFraTiltaketSvar from '../RefusjonSide/InntekterFraTiltaketSvar';
import SummeringBoks from '../RefusjonSide/SummeringBoks';
import InformasjonFraAvtalen from '../RefusjonSide/informasjonAvtalen/InformasjonFraAvtalen';
import InntekterFraAMeldingen from '../RefusjonSide/inntektsmelding/InntekterFraAMeldingen';
import InntekterFraAMeldingenKorreksjon from './InntekterFraAMeldingenKorreksjon';
import KorreksjonInfo from './KorreksjonInfo';

const KvitteringKorreksjon: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const korreksjon = useHentKorreksjon(refusjon.korreksjonId!);

    return (
        <>
            <HvitBoks>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Heading size="large" role="heading">
                        Kvittering for korrigert refusjon
                    </Heading>
                    <Tag variant="info">
                        {storForbokstav(korreksjonStatusTekst[korreksjon.status])}{' '}
                        {formatterDato(korreksjon.godkjentTidspunkt!, NORSK_DATO_OG_TID_FORMAT)}
                    </Tag>
                </div>
                <VerticalSpacer rem={1} />
                <KorreksjonInfo korreksjon={korreksjon} />
                <VerticalSpacer rem={2} />
                <InformasjonFraAvtalen />
                <VerticalSpacer rem={2} />
                <InntekterFraAMeldingenKorreksjon />
                <VerticalSpacer rem={2} />
                <InntekterFraTiltaketSvar refusjonsgrunnlag={korreksjon.refusjonsgrunnlag} />
                <VerticalSpacer rem={2} />
                <Utregning
                    beregning={korreksjon.refusjonsgrunnlag.beregning}
                    tilskuddsgrunnlag={korreksjon.refusjonsgrunnlag.tilskuddsgrunnlag}
                    inntektsgrunnlag={korreksjon.refusjonsgrunnlag.inntektsgrunnlag}
                />
                <VerticalSpacer rem={4} />
                <SummeringBoks refusjonsgrunnlag={korreksjon.refusjonsgrunnlag} status={refusjon.status} />
            </HvitBoks>

            <VerticalSpacer rem={2} />
            <ExpansionCard size="small" aria-label="Small-variant" defaultOpen={true}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title size="small">Klikk for å se refusjonen som er korrigert</ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <HvitBoks>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Heading size="large" role="heading">
                                Kvittering for refusjon
                            </Heading>
                            <Tag variant="info">
                                Sendt krav {formatterDato(refusjon.godkjentAvArbeidsgiver!, NORSK_DATO_OG_TID_FORMAT)}
                            </Tag>
                        </div>
                        <VerticalSpacer rem={1} />
                        {/* <VerticalSpacer rem={2} /> */}
                        {/* <InformasjonFraAvtalen /> */}
                        <VerticalSpacer rem={2} />
                        <InntekterFraAMeldingen kvitteringVisning={true} />
                        <VerticalSpacer rem={2} />
                        <InntekterFraTiltaketSvar refusjonsgrunnlag={refusjon.refusjonsgrunnlag} />
                        <VerticalSpacer rem={2} />
                        <Utregning
                            beregning={refusjon.refusjonsgrunnlag.beregning}
                            tilskuddsgrunnlag={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag}
                            forrigeRefusjonMinusBeløp={refusjon.refusjonsgrunnlag.forrigeRefusjonMinusBeløp}
                        />
                        <VerticalSpacer rem={4} />
                        <SummeringBoks refusjonsgrunnlag={refusjon.refusjonsgrunnlag} status={refusjon.status} />
                    </HvitBoks>
                </ExpansionCard.Content>
            </ExpansionCard>
            <VerticalSpacer rem={2} />
        </>
    );
};

export default KvitteringKorreksjon;
