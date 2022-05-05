import React, { FunctionComponent } from 'react';
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

    return (
        <td>
            {!kvitteringVisning && (
                <div className="inntektsmelding__inntektsvalg">
                    <Radio
                        label="Ja"
                        checked={erOpptjentIPeriode}
                        onChange={(e) => {
                            setInntektslinjeOpptjentIPeriode(refusjonId, inntekt.id, true);
                        }}
                        name={inntekt.id}
                    />
                    <Radio
                        label="Nei"
                        checked={typeof erOpptjentIPeriode === 'boolean' && !erOpptjentIPeriode}
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
