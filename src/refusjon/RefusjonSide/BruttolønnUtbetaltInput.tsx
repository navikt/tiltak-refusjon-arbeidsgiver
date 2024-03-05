import React, { ChangeEvent, FunctionComponent, PropsWithChildren, SetStateAction, useState } from 'react';
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
    const [lokalBruttolønnVerdi, setLokalBruttolønnVerdi] = useState('');
    const [feilmelding, setFeilmelding] = useState('');
    return (
        <>
            <TextField
                className={cls.element('bruttolønn-utbetalt-for-periode')}
                size="small"
                style={feilmelding.trim().length > 0 ? { borderColor: 'red', borderWidth: 'thick' } : {}}
                label={`Skriv inn bruttolønn utbetalt for perioden med ${
                    tiltakstypeTekst[tilskuddsgrunnlag.tiltakstype]
                }`}
                onChange={(event) => {
                    const verdi: string = event.currentTarget.value;

                    setLokalBruttolønnVerdi(verdi);

                    if (verdi.trim().length > 0 && !verdi.match(/^\d*$/)) {
                        setLokalBruttolønnVerdi(lokalBruttolønnVerdi);
                        setEndringBruttoLønn('0');
                        return;
                    }
                    if (verdi.trim().length > 0 && verdi.match(/^\d*$/) && parseInt(verdi, 10) > sumInntekterOpptjent) {
                        setFeilmelding(
                            `Tallet er høyre enn opptjent inntekt. Det må være det samme eller lavere enn ${sumInntekterOpptjent} kr.`
                        );
                        setEndringBruttoLønn('0');
                        return;
                    }

                    setEndringBruttoLønn(verdi);
                    setFeilmelding('');
                }}
                onBlur={(event) => {
                    let verdi: string = event.currentTarget.value;
                    if (feilmelding.trim().length !== 0) {
                        verdi = '0';
                    }
                    delayEndreBruttolønn(refusjon.id!, false, refusjon.sistEndret, parseInt(verdi, 10));

                    setEndringBruttoLønn(verdi);
                }}
                value={lokalBruttolønnVerdi}
            />
            <div style={{ color: 'Red', fontWeight: 'Bold' }}>{feilmelding}</div>
        </>
    );
};
export default BruttolønnUtbetaltInput;
