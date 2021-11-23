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

    return (
        <div>
            <Element>
                Er inntektene som vi har hentet (
                {formatterPenger(props.refusjonsgrunnlag.inntektsgrunnlag!!.bruttoLønn)}) kun fra tiltaket{' '}
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
