import React, { FunctionComponent, useEffect, useState } from 'react';
import { Radio } from 'nav-frontend-skjema';
import { setInntektslinjeOpptjentIPeriode } from '../../../../services/rest-service';
import { Inntektslinje } from '../../../refusjon';

interface Props {
    inntekt: Inntektslinje;
    refusjonId: string;
    kvitteringVisning: boolean;
}

const InntektValg: FunctionComponent<Props> = ({ inntekt, kvitteringVisning, refusjonId }: Props) => {
    const { erOpptjentIPeriode } = inntekt;
    const [checked, setChecked] = useState<boolean | undefined>(erOpptjentIPeriode);

    useEffect(() => {
        if (erOpptjentIPeriode !== checked) setChecked(erOpptjentIPeriode);
    }, [erOpptjentIPeriode, checked]);

    return (
        <td>
            {!kvitteringVisning && (
                <div className="inntektsmelding__inntektsvalg">
                    <Radio
                        label="Ja"
                        checked={checked === true}
                        onChange={(e) => {
                            setInntektslinjeOpptjentIPeriode(refusjonId, inntekt.id, true);
                        }}
                        name={inntekt.id}
                    />
                    <Radio
                        label="Nei"
                        checked={checked === false}
                        onChange={(e) => {
                            setInntektslinjeOpptjentIPeriode(refusjonId, inntekt.id, false);
                        }}
                        name={inntekt.id}
                    />
                </div>
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
