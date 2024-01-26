import _ from 'lodash';
import { FunctionComponent } from 'react';
import { formatterPenger } from '../../../../utils/PengeUtils';
import { NORSK_MÅNEDÅR_FORMAT, formatterDato, formatterPeriode } from '../../../../utils/datoUtils';
import { Inntektslinje } from '../../../refusjon';
import { inntektBeskrivelse } from '../InntekterFraAMeldingen';
import InntektValg from './InntektValg';

type Props = {
    refusjonId: string;
    refusjonSistEndret: string;
    inntektslinjer: Inntektslinje[];
    kvitteringVisning: boolean;
};

const InntektsmeldingTabellBody: FunctionComponent<Props> = (props) => {
    return (
        <tbody>
            {_.sortBy(
                props.inntektslinjer.filter((i) => i.erMedIInntektsgrunnlag),
                ['måned', 'opptjeningsperiodeFom', 'opptjeningsperiodeTom', 'opptjent', 'beskrivelse', 'id']
            ).map((inntekt) => (
                <tr key={inntekt.id}>
                    <td>{inntektBeskrivelse(inntekt.beskrivelse)}</td>
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
                            refusjonId={props.refusjonId}
                            kvitteringVisning={props.kvitteringVisning}
                            sistEndret={props.refusjonSistEndret}
                        />
                    )}
                    <td>{formatterPenger(inntekt.beløp)}</td>
                </tr>
            ))}
        </tbody>
    );
};

export default InntektsmeldingTabellBody;
