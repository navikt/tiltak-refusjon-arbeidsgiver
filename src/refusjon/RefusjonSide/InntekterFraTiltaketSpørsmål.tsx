import { Input, Label, RadioPanel } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { endreBruttolønn, useHentRefusjon } from '../../services/rest-service';
import { formatterPenger } from '../../utils/PengeUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { lønnsbeskrivelseTekst } from '../../messages';

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
    const bruttoLønn = refusjon.refusjonsgrunnlag.inntektsgrunnlag.bruttoLønn;

    const refunderbarInntekter = refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.skalRefunderes
    );
    const valgtBruttoLønn = refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter
        .filter((inntekt) => inntekt.skalRefunderes)
        .map((el) => el.beløp)
        .reduce((el, el2) => el + el2, 0);

    //TODO: Ikke gå over bruttolønn sum på nei (checked false) valget
    //TODO: når man velger nei skal man ikke miste beløpet/inntekt man har sagt ja til

    const svarPåSpørsmål = (checked: boolean) => {
        setInntekterKunFraTiltaket(checked);
        //TODO bør settes til valgtBruttoLønn når checked er true men det er en backend sperre på det
        if (checked) {
            setEndretBruttoLønn(undefined);
            endreBruttolønn(refusjonId!, checked, undefined);
        }
    };

    return (
        <div>
            {refunderbarInntekter.length >= 1 && (
                <div
                    style={{ display: 'grid', backgroundColor: '#CCF1D6', padding: '1em', border: '4px solid #99DEAD' }}
                >
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
                    <div style={{ display: 'flex', fontWeight: 'bold' }}>
                        <div style={{ width: '50%' }}>Beskrivelse</div>
                        <div style={{ width: '50%' }}>År/mnd</div>
                        <div>Beløp</div>
                    </div>
                    {refunderbarInntekter?.map((currInntekt) => {
                        if (currInntekt)
                            return (
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '50%' }}>{inntektBeskrivelse(currInntekt.beskrivelse)}</div>
                                    <div style={{ width: '50%' }}>{currInntekt.måned}</div>
                                    <div style={{ width: '5%' }}>{currInntekt.beløp}</div>
                                </div>
                            );
                    })}

                    <br />
                    <div style={{ display: 'flex', fontWeight: 'bold' }}>
                        <div style={{ width: '50%' }}>Sum bruttolønn</div>
                        <div style={{ width: '50%' }}></div>
                        <div>{refunderbarInntekter.length >= 1 && valgtBruttoLønn}</div>
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
                            value={'ja'}
                            checked={inntekterKunFraTiltaket === true}
                            onChange={() => {
                                svarPåSpørsmål(true);
                            }}
                        />
                        <RadioPanel
                            name="inntekterKunFraTiltaket"
                            label="Nei"
                            value={'nei'}
                            checked={inntekterKunFraTiltaket === false}
                            onChange={() => {
                                svarPåSpørsmål(false);
                            }}
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
                                    if (verdi.match(/^\d*$/) && verdi <= bruttoLønn) {
                                        setEndretBruttoLønn(verdi as number);
                                    }
                                }}
                                onBlur={() => endreBruttolønn(refusjonId!, false, endretBruttoLønn)}
                                value={endretBruttoLønn}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default InntekterFraTiltaketSpørsmål;
