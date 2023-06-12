import _ from 'lodash';
import { FunctionComponent, useContext } from 'react';
import { useParams } from 'react-router';
import { formatterPenger } from '../../../../utils/PengeUtils';
import { NORSK_MÅNEDÅR_FORMAT, formatterDato, formatterPeriode } from '../../../../utils/datoUtils';
import { Inntektslinje } from '../../../refusjon';
import { inntektBeskrivelse } from '../InntekterFraAMeldingen';
import InntektValg from './InntektValg';
import { RefusjonContext } from '../../../../RefusjonProvider';

type Props = {
    inntektslinjer: Inntektslinje[];
    kvitteringVisning: boolean;
};

const InntektsmeldingTabellBody: FunctionComponent<Props> = (props) => {
    const { refusjon, sistEndret } = useContext(RefusjonContext);
    return (
        <tbody>
            {_.sortBy(
                props.inntektslinjer.filter((i) => i.erMedIInntektsgrunnlag),
                ['måned', 'opptjeningsperiodeFom', 'opptjeningsperiodeTom', 'opptjent', 'beskrivelse', 'id']
            ).map((inntekt) => (
                <tr key={inntekt.id}>
                    <td>
                        {/* inntekt.id */} {inntektBeskrivelse(inntekt.beskrivelse)}
                    </td>
                    <td>{formatterDato(inntekt.måned, NORSK_MÅNEDÅR_FORMAT)}</td>

                    <td>
                        {inntekt.opptjeningsperiodeFom && inntekt.opptjeningsperiodeTom ? (
                            formatterPeriode(inntekt.opptjeningsperiodeFom, inntekt.opptjeningsperiodeTom, 'DD.MM')
                        ) : (
                            <em>Ikke rapportert opptjenings&shy;periode</em>
                        )}
                    </td>
                    {props.inntektslinjer.filter((inntekt) => inntekt.erOpptjentIPeriode) && (
                        <InntektValg
                            inntekt={inntekt}
                            refusjonId={refusjon.id}
                            kvitteringVisning={props.kvitteringVisning}
                            sistEndret={sistEndret}
                        />
                    )}
                    <td>{formatterPenger(inntekt.beløp)}</td>
                </tr>
            ))}
        </tbody>
    );
};

export default InntektsmeldingTabellBody;
