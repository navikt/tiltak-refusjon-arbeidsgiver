import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { FunctionComponent } from 'react';
import Utregning from '../../komponenter/Utregning';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjon } from '../refusjon';

type Props = {
    refusjon: Refusjon;
};

const RefusjonMinusBelop: FunctionComponent<Props> = (props) => {
    const feriepengebeløp = props.refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter
        .filter((inntekt) => inntekt.beskrivelse === 'feriepenger')
        .reduce((partialSum, a) => partialSum + a.beløp, 0);
    return (
        <div>
            <Utregning
                beregning={props.refusjon.refusjonsgrunnlag.beregning}
                tilskuddsgrunnlag={props.refusjon.refusjonsgrunnlag.tilskuddsgrunnlag}
                visMinusSomNull={true}
            />
            <AlertStripeInfo>
                Fratrekk for ferie er høyere enn bruttolønn, dere har dermed ikke hatt noen lønnskostnader denne
                perioden. Det er derfor ingen refusjon for denne perioden.
                {feriepengebeløp && (
                    <>
                        <VerticalSpacer rem={0.5} />
                        Det er i denne perioden betalt ut feriepenger ({formatterPenger(feriepengebeløp)}). Dette
                        refunderes ikke, fordi de månedlige avsatte feriepengene regnes med i tilskuddet.
                    </>
                )}
            </AlertStripeInfo>
        </div>
    );
};

export default RefusjonMinusBelop;
