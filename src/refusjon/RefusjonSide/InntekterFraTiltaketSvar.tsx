import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjonsgrunnlag } from '../refusjon';

type Props = {
    refusjonsgrunnlag: Refusjonsgrunnlag;
};

const InntekterFraTiltaketSvar: FunctionComponent<Props> = (props) => {
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

    return (
        <div>
            <Element>
                Er inntektene du har valgt ({formatterPenger(valgtBruttoLønn as number)}) kun fra tiltaket{' '}
                {tiltakstypeTekst[props.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]}?{' '}
            </Element>
            <Normaltekst>{props.refusjonsgrunnlag.inntekterKunFraTiltaket ? 'Ja' : 'Nei'}</Normaltekst>
            {props.refusjonsgrunnlag.endretBruttoLønn !== null &&
                props.refusjonsgrunnlag.endretBruttoLønn !== undefined && (
                    <>
                        <VerticalSpacer rem={1} />
                        <Element>Korrigert brutto lønn:</Element>
                        <Normaltekst>{formatterPenger(props.refusjonsgrunnlag.endretBruttoLønn)}</Normaltekst>
                    </>
                )}
        </div>
    );
};

export default InntekterFraTiltaketSvar;
