import { Label, BodyShort, Heading } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { formatterPeriode, månedsNavn } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjon } from '../refusjon';
import InntekterOpptjentIPeriodeTabell from './InntekterOpptjentIPeriodeTabell';
import Boks from '../../komponenter/Boks/Boks';

type Props = {
    refusjon: Refusjon;
};

const InntekterFraTiltaketSvar: FunctionComponent<Props> = ({ refusjon }) => {
    const refusjonNummer = `${refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.avtaleNr}-${refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.løpenummer}`;
    const periode = formatterPeriode(
        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom,
        'DD.MM'
    );

    if (
        refusjon.refusjonsgrunnlag.inntekterKunFraTiltaket === null ||
        refusjon.refusjonsgrunnlag.inntekterKunFraTiltaket === undefined
    ) {
        return null;
    }

    const valgtBruttoLønn = refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter
        .filter((inntekt) => inntekt.erOpptjentIPeriode)
        .map((el) => el.beløp)
        .reduce((el, el2) => el + el2, 0);

    if (!refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter) {
        return null;
    }
    const månedNavn = månedsNavn(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);

    return (
        <div>
            <Boks variant="grønn">
                <Heading size="small">
                    Inntekter som refunderes for{' '}
                    {formatterPeriode(
                        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                    )}
                </Heading>
                <VerticalSpacer rem={1} />
                <InntekterOpptjentIPeriodeTabell
                    inntekter={refusjon.refusjonsgrunnlag.inntektsgrunnlag.inntekter}
                    månedsNavn={månedNavn}
                />
                <VerticalSpacer rem={2} />
                <Label>
                    Er inntektene du har huket av ({formatterPenger(valgtBruttoLønn as number)}) tilknyttet
                    refusjonssnummer {refusjonNummer} <br />
                    for perioden {periode} for tiltaket{' '}
                    {tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]} ?
                </Label>
                <BodyShort size="small">{refusjon.refusjonsgrunnlag.inntekterKunFraTiltaket ? 'Ja' : 'Nei'}</BodyShort>
                {refusjon.refusjonsgrunnlag.endretBruttoLønn !== null &&
                    refusjon.refusjonsgrunnlag.endretBruttoLønn !== undefined && (
                        <>
                            <VerticalSpacer rem={1} />
                            <Label>Korrigert bruttolønn:</Label>
                            <BodyShort size="small">
                                {formatterPenger(refusjon.refusjonsgrunnlag.endretBruttoLønn)}
                            </BodyShort>
                        </>
                    )}
            </Boks>
        </div>
    );
};

export default InntekterFraTiltaketSvar;
