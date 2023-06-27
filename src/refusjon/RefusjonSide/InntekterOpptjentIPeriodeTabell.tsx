import _ from 'lodash';
import { Label } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { NORSK_MÅNEDÅR_FORMAT, formatterDato, formatterPeriode } from '../../utils/datoUtils';
import { Inntektslinje } from '../refusjon';
import { inntektBeskrivelse } from './inntektsmelding/InntekterFraAMeldingen';

type Props = {
    inntekter: Inntektslinje[];
    månedsNavn: string;
};

const InntekterTabell = styled.table`
    width: 100%;
    th,
    td {
        text-align: left;
        padding: 0.35rem 0.5rem;
    }
    th:first-child,
    td:first-child {
        padding: 0.35rem 0;
    }
    th:last-child,
    td:last-child {
        text-align: right;
        padding: 0.35rem 0;
    }
`;

const InntekterOpptjentIPeriodeTabell: FunctionComponent<Props> = (props) => {
    const inntekterHuketAvForOpptjentIPeriode = props.inntekter.filter((inntekt) => inntekt.erOpptjentIPeriode);
    const sumInntekterOpptjentIPeriode = _.sumBy(inntekterHuketAvForOpptjentIPeriode, 'beløp');

    const sorterInntektslinjer = (inntektslinjer: Inntektslinje[]) =>
        _.sortBy(inntektslinjer, [
            'måned',
            'opptjeningsperiodeFom',
            'opptjeningsperiodeTom',
            'opptjent',
            'beskrivelse',
            'id',
        ]);

    return (
        <div>
            <InntekterTabell>
                <thead>
                    <tr>
                        <th>Beskriv&shy;else</th>
                        <th>År/mnd</th>
                        <th>Rapportert opptjeningsperiode</th>
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
            </InntekterTabell>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Label>Sum bruttolønn</Label>
                <Label>{inntekterHuketAvForOpptjentIPeriode.length >= 1 && sumInntekterOpptjentIPeriode}</Label>
            </div>
        </div>
    );
};

export default InntekterOpptjentIPeriodeTabell;
