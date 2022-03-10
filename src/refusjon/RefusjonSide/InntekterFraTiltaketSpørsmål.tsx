import { Input, Label, RadioPanel } from 'nav-frontend-skjema';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst, tiltakstypeTekst } from '../../messages';
import { endreBruttolønn, useHentRefusjon } from '../../services/rest-service';
import { formatterPenger } from '../../utils/PengeUtils';

const RadioPakning = styled.div`
    display: flex;
    flex-direction: row;
    label {
        flex-grow: 1;
        margin-right: 0.5rem;
        &:last-child {
            margin-right: 0;
        }
    }
`;
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
const GrønnBoks = styled.div`
    background-color: #CCF1D6;
    padding: 1em;
    border: 4px solid #99DEAD;
`;

const inntektBeskrivelse = (beskrivelse: string | undefined) => {
    if (beskrivelse === undefined) {
        return '';
    } else if (beskrivelse === '') {
        return 'Inntekt';
    } else {
        return lønnsbeskrivelseTekst[beskrivelse] ?? 'Inntekt: ' + beskrivelse;
    }
};

const InntekterFraTiltaketSpørsmål: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const [inntekterKunFraTiltaket, setInntekterKunFraTiltaket] = useState(
        refusjon.refusjonsgrunnlag.inntekterKunFraTiltaket
    );
    const [endretBruttoLønn, setEndretBruttoLønn] = useState(refusjon.refusjonsgrunnlag.endretBruttoLønn);
    if (refusjon.refusjonsgrunnlag.inntektsgrunnlag === undefined) {
        return null;
    }

    const refunderbarInntekter = refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.skalRefunderes
    );
    const valgtBruttoLønn = refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter
        .filter((inntekt) => inntekt.skalRefunderes)
        .map((el) => el.beløp)
        .reduce((el, el2) => el + el2, 0);

    return (
        <div>
            {refunderbarInntekter.length >= 1 && (
                <GrønnBoks>
                    <Undertittel>
                        Inntekter som skal refunderes for {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom} til{' '}
                        {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom}
                    </Undertittel>
                    <VerticalSpacer rem={1} />
                    <Normaltekst>
                        Dette er inntekter som er opptjent i perioden. Det vil gjøres en utregning under med sum
                        bruttolønn som grunnlag.
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <InntekterTabell>
                        <thead>
                            <tr>
                                <th>Beskriv&shy;else</th>
                                <th>År/mnd</th>
                                <th>Beløp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {refunderbarInntekter.map((inntekt) => (
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
                        <Element>{refunderbarInntekter.length >= 1 && valgtBruttoLønn}</Element>
                    </div>

                    <VerticalSpacer rem={1} />
                    <Label htmlFor={'inntekterKunFraTiltaket'}>
                        Er inntektene som vi har hentet{' '}
                        {refusjon.refusjonsgrunnlag.inntektsgrunnlag.bruttoLønn > 0 && (
                            <>({formatterPenger(valgtBruttoLønn)})</>
                        )}{' '}
                        kun fra tiltaket {tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]}?
                    </Label>
                    <p>
                        <i>
                            Du skal svare "nei" hvis noen av inntektene er fra f. eks. vanlig lønn eller lønnstilskudd
                        </i>
                    </p>
                    <RadioPakning>
                        <RadioPanel
                            name="inntekterKunFraTiltaket"
                            label="Ja"
                            //value={'ja'}
                            checked={inntekterKunFraTiltaket === true}
                            onChange={(e) => {
                                setInntekterKunFraTiltaket(e.currentTarget.checked);
                                setEndretBruttoLønn(undefined);
                                endreBruttolønn(refusjonId!, true, undefined);
                            }}
                        />
                        <RadioPanel
                            name="inntekterKunFraTiltaket"
                            label="Nei"
                            //value={'nei'}
                            checked={inntekterKunFraTiltaket === false}
                            onChange={(e) => setInntekterKunFraTiltaket(!e.currentTarget.checked)}
                        />
                    </RadioPakning>

                    {inntekterKunFraTiltaket === false && (
                        <>
                            <VerticalSpacer rem={1} />
                            <Input
                                bredde={'S'}
                                label={`Skriv inn bruttolønn utbetalt for ${
                                    tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]
                                } perioden`}
                                onChange={(event: any) => {
                                    const verdi = event.currentTarget.value;
                                    if (verdi.match(/^\d*$/) && verdi <= valgtBruttoLønn) {
                                        setEndretBruttoLønn(verdi as number);
                                    }
                                }}
                                onBlur={() => endreBruttolønn(refusjonId!, false, endretBruttoLønn)}
                                value={endretBruttoLønn}
                            />
                        </>
                    )}
                </GrønnBoks>
            )}
        </div>
    );
};

export default InntekterFraTiltaketSpørsmål;
