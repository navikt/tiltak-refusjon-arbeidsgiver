import React, { ChangeEvent, FunctionComponent } from 'react';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { setInntektslinjeOpptjentIPeriode } from '../../../../services/rest-service';
import { Inntektslinje } from '../../../refusjon';

interface Props {
    inntekt: Inntektslinje;
    refusjonId: string;
    kvitteringVisning: boolean;
}

const InntektValg: FunctionComponent<Props> = ({ inntekt, kvitteringVisning, refusjonId }: Props) => {
    const { erOpptjentIPeriode } = inntekt;

    const setInntektslinje = (
        refusjonId: string,
        inntektslinjeId: string,
        erOpptjentIPeriode: boolean
    ): Promise<void> =>
        setInntektslinjeOpptjentIPeriode(refusjonId, inntektslinjeId, erOpptjentIPeriode).catch((err) =>
            console.error('err ', err)
        );

    return (
        <td>
            {!kvitteringVisning && (
                <RadioGroup legend="" className="inntektsmelding__inntektsvalg">
                    <Radio
                        value="ja"
                        checked={erOpptjentIPeriode}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            return setInntektslinje(refusjonId, inntekt.id, true);
                        }}
                        name={inntekt.id}
                    >
                        Ja
                    </Radio>
                    <Radio
                        value="Nei"
                        checked={typeof erOpptjentIPeriode === 'boolean' && !erOpptjentIPeriode}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            return setInntektslinje(refusjonId, inntekt.id, false);
                        }}
                        name={inntekt.id}
                    >
                        Nei
                    </Radio>
                </RadioGroup>
            )}
            {kvitteringVisning && (
                <div className="inntektsmelding__valgtInntekt">
                    {inntekt.erOpptjentIPeriode ? <label>Ja</label> : <label>Nei</label>}
                </div>
            )}
        </td>
    );
};
export default InntektValg;
