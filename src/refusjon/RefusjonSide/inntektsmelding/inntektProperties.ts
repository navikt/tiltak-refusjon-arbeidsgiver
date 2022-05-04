import { Refusjon } from '../../refusjon';

export const inntektProperties = (refusjon: Refusjon) => {
    const { inntektsgrunnlag } = refusjon.refusjonsgrunnlag;

    const antallInntekterSomErMedIGrunnlag: number | undefined = inntektsgrunnlag?.inntekter.filter(
        (i) => i.erMedIInntektsgrunnlag
    ).length;

    const ingenInntekter: boolean = !inntektsgrunnlag || inntektsgrunnlag?.inntekter.length === 0;

    const ingenRefunderbareInntekter: boolean =
        !!inntektsgrunnlag && inntektsgrunnlag.inntekter.length > 0 && antallInntekterSomErMedIGrunnlag === 0;

    const harInntekterMenIkkeForHeleTilskuddsperioden: boolean =
        refusjon.status === 'KLAR_FOR_INNSENDING' &&
        !refusjon.harInntektIAlleMåneder &&
        !!inntektsgrunnlag &&
        inntektsgrunnlag.inntekter.find((i) => i.erMedIInntektsgrunnlag) !== undefined;

    return {
        antallInntekterSomErMedIGrunnlag,
        ingenInntekter,
        ingenRefunderbareInntekter,
        harInntekterMenIkkeForHeleTilskuddsperioden,
    };
};
