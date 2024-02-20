import { Inntektsgrunnlag, Inntektslinje } from '../refusjon/refusjon';

export const sumInntekterOpptjentIPeriode = (inntektsgrunnlag: Inntektsgrunnlag): number =>
    inntektsgrunnlag?.inntekter
        .filter((inntektFraPeriode: Inntektslinje) => inntektFraPeriode.erOpptjentIPeriode)
        .map((inntekt: Inntektslinje) => inntekt.beløp)
        .reduce((previousBeløp, currentBeløp) => previousBeløp + currentBeløp, 0);

export const valgtBruttoLønn = (inntekter: Inntektslinje[]) =>
    inntekter
        .filter((inntekt) => inntekt.erOpptjentIPeriode)
        .map((el) => el.beløp)
        .reduce((el, el2) => el + el2, 0);
