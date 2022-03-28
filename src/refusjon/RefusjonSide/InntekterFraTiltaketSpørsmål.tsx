import { Input, Label, RadioPanel } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { endreBruttolønn, useHentRefusjon } from '../../services/rest-service';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import InntekterOpptjentIPeriodeTabell from './InntekterOpptjentIPeriodeTabell';

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

export const GrønnBoks = styled.div`
    background-color: #ccf1d6;
    padding: 1em;
    border: 4px solid #99dead;
`;

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

    const inntekterHuketAvForOpptjentIPeriode = refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.erOpptjentIPeriode
    );
    const sumInntekterOpptjentIPeriode = refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter
        .filter((inntekt) => inntekt.erOpptjentIPeriode)
        .map((el) => el.beløp)
        .reduce((el, el2) => el + el2, 0);

    return (
        <div>
            {inntekterHuketAvForOpptjentIPeriode.length >= 1 && (
                <GrønnBoks>
                    <Undertittel>
                        Inntekter som skal refunderes for{' '}
                        {formatterPeriode(
                            refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                            refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                        )}
                    </Undertittel>
                    <VerticalSpacer rem={1} />
                    <Normaltekst>
                        Dette er inntekter som er opptjent i perioden. Det vil gjøres en utregning under med sum
                        bruttolønn som grunnlag.
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <InntekterOpptjentIPeriodeTabell
                        inntekter={refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter}
                    />
                    <VerticalSpacer rem={1} />
                    <Label htmlFor={'inntekterKunFraTiltaket'}>
                        Er inntektene som du har huket av for{' '}
                        {sumInntekterOpptjentIPeriode > 0 && <>({formatterPenger(sumInntekterOpptjentIPeriode)})</>} kun
                        fra tiltaket {tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]}?
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
                                    if (verdi.match(/^\d*$/) && verdi <= sumInntekterOpptjentIPeriode) {
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
