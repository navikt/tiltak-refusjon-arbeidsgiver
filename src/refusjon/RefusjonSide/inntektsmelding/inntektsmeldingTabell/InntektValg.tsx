import React, { ChangeEvent, FunctionComponent } from 'react';
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
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            setInntektslinjeOpptjentIPeriode(refusjonId, inntekt.id, true).catch((err) =>
                                console.error('err ', err)
                            );
                        }}
                        name={inntekt.id}
                    />
                    <Radio
                        label="Nei"
                        checked={typeof erOpptjentIPeriode === 'boolean' && !erOpptjentIPeriode}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            setInntektslinjeOpptjentIPeriode(refusjonId, inntekt.id, false).catch((err) =>
                                console.error('err ', err)
                            );
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
