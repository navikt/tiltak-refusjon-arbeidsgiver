import { sortBy, sumBy } from 'lodash';
import { Label } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import { NORSK_MÅNEDÅR_FORMAT, formatterDato, formatterPeriode } from '../../utils/datoUtils';
import { Inntektslinje } from '../refusjon';
import { inntektBeskrivelse } from './inntektsmelding/InntekterFraAMeldingen';
import BEMHelper from '../../utils/bem';
import '../RefusjonSide/InntekterFraAMeldingen.less';

type Props = {
    inntekter: Inntektslinje[];
    månedsNavn: string;
};

const InntekterOpptjentIPeriodeTabell: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper('inntekterFraAMeldingen');
    const inntekterHuketAvForOpptjentIPeriode = props.inntekter.filter((inntekt) => inntekt.erOpptjentIPeriode);
    const sumInntekterOpptjentIPeriode = sumBy(inntekterHuketAvForOpptjentIPeriode, 'beløp');

    const sorterInntektslinjer = (inntektslinjer: Inntektslinje[]) =>
        sortBy(inntektslinjer, [
            'måned',
            'opptjeningsperiodeFom',
            'opptjeningsperiodeTom',
            'opptjent',
            'beskrivelse',
            'id',
        ]);

    return (
        <div>
            <table className={cls.element('inntekterTabell')}>
                <thead>
                    <tr>
                        <th>Beskriv&shy;else</th>
                        <th>År/mnd</th>
                        <th>Opptjenings&shy;periode</th>
                        <th>Opptjent i {props.månedsNavn}?</th>
                        <th>Beløp</th>
                    </tr>
                </thead>
                <tbody>
                    {sorterInntektslinjer(inntekterHuketAvForOpptjentIPeriode).map((inntekt) => (
                        <tr key={inntekt.id}>
                            <td>{inntektBeskrivelse(inntekt.beskrivelse)}</td>
                            <td>{formatterDato(inntekt.måned, NORSK_MÅNEDÅR_FORMAT)}</td>
                            <td>
                                {inntekt.opptjeningsperiodeFom && inntekt.opptjeningsperiodeTom ? (
                                    formatterPeriode(
                                        inntekt.opptjeningsperiodeFom,
                                        inntekt.opptjeningsperiodeTom,
                                        'DD.MM'
                                    )
                                ) : (
                                    <em>Ikke rapportert opptjenings&shy;periode</em>
                                )}
                            </td>
                            <td>{inntekt.erOpptjentIPeriode ? 'Ja' : 'Nei'}</td>
                            <td>{inntekt.beløp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Label>Sum bruttolønn</Label>
                <Label>{inntekterHuketAvForOpptjentIPeriode.length >= 1 && sumInntekterOpptjentIPeriode}</Label>
            </div>
        </div>
    );
};

export default InntekterOpptjentIPeriodeTabell;
