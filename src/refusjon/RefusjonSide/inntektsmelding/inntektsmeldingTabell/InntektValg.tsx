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

    const inntektValg = () => {
        switch (inntekt.erOpptjentIPeriode) {
            case true:
                return 'Ja';
            case false:
                return 'Nei';
            default:
                return 'Ikke valgt';
        }
    };

    let radioverdi = undefined;
    if (erOpptjentIPeriode) radioverdi = 'ja';
    if (erOpptjentIPeriode === false) radioverdi = 'nei';

    return (
        <td>
            {!kvitteringVisning && (
                <RadioGroup legend="" className="inntektsmelding__inntektsvalg" value={radioverdi}>
                    <Radio
                        value="ja"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            return setInntektslinje(refusjonId, inntekt.id, true);
                        }}
                        name={inntekt.id}
                    >
                        Ja
                    </Radio>
                    <Radio
                        value="nei"
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
                    <label>{inntektValg()}</label>
                </div>
            )}
        </td>
    );
};
export default InntektValg;
