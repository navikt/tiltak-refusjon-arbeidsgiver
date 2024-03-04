import React, { ChangeEvent, FunctionComponent, PropsWithChildren, SetStateAction } from 'react';
import { BodyShort, TextField } from '@navikt/ds-react';
import { Inntektsgrunnlag, Refusjon } from '../refusjon';
import { tiltakstypeTekst } from '@/messages';
import BEMHelper from '@/utils/bem';
import { sumInntekterOpptjentIPeriode } from '@/utils/inntekterUtiles';

interface Properties {
    refusjon: Refusjon;
    inntektsgrunnlag: Inntektsgrunnlag;
    setEndringBruttoLønn: React.Dispatch<SetStateAction<string>>;
    endringBruttoLønn: string;
    delayEndreBruttolønn: Function;
}

const BruttolønnUtbetaltInput: FunctionComponent<Properties> = ({
    refusjon,
    inntektsgrunnlag,
    setEndringBruttoLønn,
    endringBruttoLønn,
    delayEndreBruttolønn,
}: PropsWithChildren<Properties>) => {
    const cls = BEMHelper('refusjonside');
    const sumInntekterOpptjent: number = sumInntekterOpptjentIPeriode(inntektsgrunnlag);
    const { tilskuddsgrunnlag, beregning } = refusjon.refusjonsgrunnlag;
    return (
        <TextField
            className={cls.element('bruttolønn-utbetalt-for-periode')}
            size="small"
            label={`Skriv inn bruttolønn utbetalt for perioden med ${tiltakstypeTekst[tilskuddsgrunnlag.tiltakstype]}`}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const verdi: string = event.currentTarget.value;
                if (verdi.match(/^\d*$/) && parseInt(verdi, 10) <= sumInntekterOpptjent) {
                    setEndringBruttoLønn(verdi);
                }
                if (!verdi) {
                    setEndringBruttoLønn('');
                }
            }}
            onBlur={() =>
                delayEndreBruttolønn(refusjon.id!, false, refusjon.sistEndret, parseInt(endringBruttoLønn, 10))
            }
            value={endringBruttoLønn}
        />
    );
};
export default BruttolønnUtbetaltInput;
