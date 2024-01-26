import { Label, BodyShort, Heading } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { formatterPeriode, månedsNavn } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjonsgrunnlag } from '../refusjon';
import InntekterOpptjentIPeriodeTabell from './InntekterOpptjentIPeriodeTabell';
import Boks from '../../komponenter/Boks/Boks';

type Props = {
    refusjonsgrunnlag: Refusjonsgrunnlag;
};

const InntekterFraTiltaketSvar: FunctionComponent<Props> = (props) => {
    const refusjonNummer = `${props.refusjonsgrunnlag.tilskuddsgrunnlag.avtaleNr}-${props.refusjonsgrunnlag.tilskuddsgrunnlag.løpenummer}`;
    const periode = formatterPeriode(
        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom,
        'DD.MM'
    );

    if (
        props.refusjonsgrunnlag.inntekterKunFraTiltaket === null ||
        props.refusjonsgrunnlag.inntekterKunFraTiltaket === undefined
    ) {
        return null;
    }

    const valgtBruttoLønn = props.refusjonsgrunnlag.inntektsgrunnlag?.inntekter
        .filter((inntekt) => inntekt.erOpptjentIPeriode)
        .map((el) => el.beløp)
        .reduce((el, el2) => el + el2, 0);

    if (!props.refusjonsgrunnlag.inntektsgrunnlag?.inntekter) {
        return null;
    }
    const månedNavn = månedsNavn(props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);

    return (
        <div>
            <Boks variant="grønn">
                <Heading size="small">
                    Inntekter som refunderes for{' '}
                    {formatterPeriode(
                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                    )}
                </Heading>
                <VerticalSpacer rem={1} />
                <InntekterOpptjentIPeriodeTabell
                    inntekter={props.refusjonsgrunnlag.inntektsgrunnlag.inntekter}
                    månedsNavn={månedNavn}
                />
                <VerticalSpacer rem={2} />
                <Label>
                    Er inntektene du har huket av ({formatterPenger(valgtBruttoLønn as number)}) tilknyttet
                    refusjonssnummer {refusjonNummer} <br />
                    for perioden {periode} for tiltaket{' '}
                    {tiltakstypeTekst[props.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]} ?
                </Label>
                <BodyShort size="small">{props.refusjonsgrunnlag.inntekterKunFraTiltaket ? 'Ja' : 'Nei'}</BodyShort>
                {props.refusjonsgrunnlag.endretBruttoLønn !== null &&
                    props.refusjonsgrunnlag.endretBruttoLønn !== undefined && (
                        <>
                            <VerticalSpacer rem={1} />
                            <Label>Korrigert bruttolønn:</Label>
                            <BodyShort size="small">
                                {formatterPenger(props.refusjonsgrunnlag.endretBruttoLønn)}
                            </BodyShort>
                        </>
                    )}
            </Boks>
        </div>
    );
};

export default InntekterFraTiltaketSvar;
