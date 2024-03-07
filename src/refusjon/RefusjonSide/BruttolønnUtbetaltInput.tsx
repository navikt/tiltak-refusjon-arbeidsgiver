import React, { ChangeEvent, Dispatch, FunctionComponent, PropsWithChildren, SetStateAction, useState } from 'react';
import { Alert, BodyShort, TextField } from '@navikt/ds-react';
import { Inntektsgrunnlag, Refusjon } from '../refusjon';
import { tiltakstypeTekst } from '@/messages';
import BEMHelper from '@/utils/bem';
import { sumInntekterOpptjentIPeriode } from '@/utils/inntekterUtiles';
import VerticalSpacer from '@/komponenter/VerticalSpacer';

interface Properties {
    refusjon: Refusjon;
    inntektsgrunnlag: Inntektsgrunnlag;
    setEndringBruttoLønn: React.Dispatch<SetStateAction<string>>;
    endringBruttoLønn: string;
    delayEndreBruttolønn: Function;
    setVisRefusjonInnsending: Dispatch<SetStateAction<boolean>>;
}

const BruttolønnUtbetaltInput: FunctionComponent<Properties> = ({
    refusjon,
    inntektsgrunnlag,
    setEndringBruttoLønn,
    endringBruttoLønn,
    delayEndreBruttolønn,
    setVisRefusjonInnsending,
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
                inputMode="numeric"
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
                        setVisRefusjonInnsending(false);
                        return;
                    }
                    if (verdi.trim().length > 0 && verdi.match(/^\d*$/) && parseInt(verdi, 10) > sumInntekterOpptjent) {
                        setFeilmelding(
                            `Beløpet er høyre enn sum bruttolønn. Det må være det samme eller lavere enn ${sumInntekterOpptjent} kr.`
                        );
                        setEndringBruttoLønn('0');
                        setVisRefusjonInnsending(false);
                        return;
                    }

                    setEndringBruttoLønn(verdi);
                    setFeilmelding('');
                    if (verdi.trim().length === 0) setVisRefusjonInnsending(false);
                }}
                onBlur={(event) => {
                    let verdi: string = event.currentTarget.value;
                    if (feilmelding.trim().length !== 0) {
                        verdi = '0';
                        setVisRefusjonInnsending(false);
                    } else {
                        setVisRefusjonInnsending(true);
                    }
                    delayEndreBruttolønn(refusjon.id!, false, refusjon.sistEndret, parseInt(verdi, 10));

                    setEndringBruttoLønn(verdi);
                }}
                value={lokalBruttolønnVerdi}
            />
            {feilmelding.trim().length > 0 && (
                <div>
                    <VerticalSpacer rem={0.5} />
                    <Alert variant="warning" size="small">
                        {feilmelding}
                    </Alert>
                </div>
            )}
        </>
    );
};
export default BruttolønnUtbetaltInput;
