import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Inntektslinje } from '../refusjon';
import { inntektBeskrivelse } from './InntekterFraAMeldingen';

type Props = {
    inntekter: Inntektslinje[];
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
    const sumInntekterOpptjentIPeriode = props.inntekter
        .filter((inntekt) => inntekt.erOpptjentIPeriode)
        .map((el) => el.beløp)
        .reduce((el, el2) => el + el2, 0);

    return (
        <div>
            <InntekterTabell>
                <thead>
                    <tr>
                        <th>Beskriv&shy;else</th>
                        <th>År/mnd</th>
                        <th>Beløp</th>
                    </tr>
                </thead>
                <tbody>
                    {inntekterHuketAvForOpptjentIPeriode.map((inntekt) => (
                        <tr key={inntekt.id}>
                            <td>{inntektBeskrivelse(inntekt.beskrivelse)}</td>
                            <td>{inntekt.måned}</td>
                            <td>{inntekt.beløp}</td>
                        </tr>
                    ))}
                </tbody>
            </InntekterTabell>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Element>Sum bruttolønn</Element>
                <Element>{inntekterHuketAvForOpptjentIPeriode.length >= 1 && sumInntekterOpptjentIPeriode}</Element>
            </div>
        </div>
    );
};

export default InntekterOpptjentIPeriodeTabell;
