import React, { ChangeEvent, FunctionComponent, useContext } from 'react';
import { Radio } from 'nav-frontend-skjema';
import { setInntektslinjeOpptjentIPeriode } from '../../../../services/rest-service';
import { Inntektslinje } from '../../../refusjon';
import { RefusjonContext } from '../../../../RefusjonProvider';

interface Props {
    inntekt: Inntektslinje;
    refusjonId: string;
    kvitteringVisning: boolean;
    sistEndret: string;
}

const InntektValg: FunctionComponent<Props> = ({ inntekt, kvitteringVisning, refusjonId, sistEndret }: Props) => {
    const { erOpptjentIPeriode } = inntekt;
    const { lasterNå, setLasterNå } = useContext(RefusjonContext);
    const setInntektslinje = (
        refusjonId: string,
        inntektslinjeId: string,
        erOpptjentIPeriode: boolean,
        sistEndret: string
    ): Promise<void> =>
        setInntektslinjeOpptjentIPeriode(refusjonId, inntektslinjeId, erOpptjentIPeriode, sistEndret).catch((err) => {
            alert('Samtidige endringer - Skal refreshe siden. Vennligst prøv igjen.');
            window.location.reload();
        });

    return (
        <td>
            {!kvitteringVisning && (
                <div className="inntektsmelding__inntektsvalg">
                    <Radio
                        label="Ja"
                        disabled={lasterNå}
                        checked={erOpptjentIPeriode}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            setLasterNå(true);
                            const svar = setInntektslinje(refusjonId, inntekt.id, true, sistEndret);
                            svar.then(() => setLasterNå(false));
                        }}
                        name={inntekt.id}
                    />
                    <Radio
                        label="Nei"
                        disabled={lasterNå}
                        checked={typeof erOpptjentIPeriode === 'boolean' && !erOpptjentIPeriode}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            setLasterNå(true);
                            const svar = setInntektslinje(refusjonId, inntekt.id, false, sistEndret);
                            svar.then(() => setLasterNå(false));
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
