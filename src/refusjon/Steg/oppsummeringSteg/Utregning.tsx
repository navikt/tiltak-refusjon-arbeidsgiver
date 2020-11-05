import React, { FunctionComponent } from 'react';
import { ReactComponent as Pengesekken } from '@/asset/image/pengesekkdollar.svg';
import { ReactComponent as Stranden } from '@/asset/image/strand.svg';
import { ReactComponent as Sykepenger } from '@/asset/image/sykepenger.svg';
import { ReactComponent as Sparegris } from '@/asset/image/sparegris.svg';
import { ReactComponent as Bygg } from '@/asset/image/bygg.svg';
import Utregningsrad from './Utregningsrad';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';

interface Props {
    bruttolonn: number;
    fratrekkFerie: number;
    sykepenger: number;
    sumLonnsgrunnlag: number;
    satsFeriepenger: number;
    feriepenger: number;
    satsOtp: number;
    belopOtp: number;
    satsArbeidsgiveravgift: number;
    arbeidsgiverAvgift: number;
    sumRefusjonsgrunnlag: number;
}

const Utregning: FunctionComponent<Props> = (props: Props) => {
    return (
        <div>
            <Utregningsrad
                labelIkon={<Pengesekken />}
                labelTekst="Brutto lønn i perioden"
                verdiSum={props.bruttolonn}
            />
            <Utregningsrad
                labelIkon={<Stranden />}
                labelTekst="Avviklede feriedager"
                verdiOperator="-"
                verdiSum={props.fratrekkFerie}
            />
            <Utregningsrad
                labelIkon={<Sykepenger />}
                labelTekst="Sykepenger"
                verdiOperator="-"
                verdiSum={props.sykepenger}
            />
            <Utregningsrad
                labelTekst="Sum refusjonsgrunnlag lønnsutgifter"
                verdiOperator="="
                verdiSum={props.sumLonnsgrunnlag}
                borderTykk={true}
            />
            <Utregningsrad
                labelIkon={<Stranden />}
                labelTekst="Feriepenger"
                labelSats={props.satsFeriepenger}
                verdiOperator="+"
                verdiSum={props.feriepenger}
            />
            <Utregningsrad
                labelIkon={<Sparegris />}
                labelTekst="Innskudd obligatorisk tjenestepensjon"
                labelSats={props.satsOtp}
                verdiOperator="+"
                verdiSum={props.belopOtp}
            />
            <Utregningsrad
                labelIkon={<Bygg />}
                labelTekst="Arbeidsgiveravgift"
                labelSats={props.satsArbeidsgiveravgift}
                verdiOperator="+"
                verdiSum={props.arbeidsgiverAvgift}
            />
            <Utregningsrad
                labelTekst="Refusjonsgrunnlag"
                verdiOperator="="
                verdiSum={props.sumRefusjonsgrunnlag}
                borderTykk={true}
            />
            <VerticalSpacer rem={1} />
        </div>
    );
};

export default Utregning;
