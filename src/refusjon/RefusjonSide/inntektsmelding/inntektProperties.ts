import { Refusjon } from '../../refusjon';

export const inntektProperties = (refusjon: Refusjon) => {
    const { inntektsgrunnlag } = refusjon.refusjonsgrunnlag;

    const antallInntekterSomErMedIGrunnlag: number | undefined = inntektsgrunnlag?.inntekter.filter(
        (i) => i.erMedIInntektsgrunnlag
    ).length;

    const ingenInntekter: boolean = !inntektsgrunnlag || inntektsgrunnlag?.inntekter.length === 0;

    const ingenRefunderbareInntekter: boolean =
        !!inntektsgrunnlag && inntektsgrunnlag.inntekter.length > 0 && antallInntekterSomErMedIGrunnlag === 0;

    return {
        antallInntekterSomErMedIGrunnlag,
        ingenInntekter,
        ingenRefunderbareInntekter,
    };
};
