import { Input, Label, RadioPanel } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { endreBruttolønn, useHentRefusjon } from '../../services/rest-service';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import InntekterOpptjentIPeriodeTabell from './InntekterOpptjentIPeriodeTabell';
import { Refusjon } from '../refusjon';
import BEMHelper from '../../utils/bem';
import { sumInntekterOpptjentIPeriode } from '../../utils/inntekterUtiles';

export const GrønnBoks = styled.div`
    background-color: #ccf1d6;
    padding: 1em;
    border: 4px solid #99dead;
`;

const InntekterFraTiltaketSpørsmål: FunctionComponent = () => {
    const cls = BEMHelper('refusjonside');
    const { refusjonId } = useParams();
    const refusjon: Refusjon = useHentRefusjon(refusjonId);
    const { inntektsgrunnlag, tilskuddsgrunnlag, inntekterKunFraTiltaket, endretBruttoLønn } =
        refusjon.refusjonsgrunnlag;
    const [inntekterKunTiltaket, setInntekterKunTiltaket] = useState<boolean | undefined>(inntekterKunFraTiltaket);
    const [endringBruttoLønn, setEndringBruttoLønn] = useState<number | undefined>(endretBruttoLønn);

    useEffect(() => {
        setInntekterKunTiltaket(inntekterKunFraTiltaket);
    }, [inntekterKunFraTiltaket]);

    if (
        inntektsgrunnlag === undefined ||
        !refusjon.harTattStillingTilAlleInntektslinjer ||
        !inntektsgrunnlag?.inntekter?.find((inntekt) => inntekt.erMedIInntektsgrunnlag) ||
        inntektsgrunnlag?.inntekter.filter((inntekt) => inntekt.erOpptjentIPeriode).length < 1
    ) {
        return null;
    }

    const sumInntekterOpptjent: number = sumInntekterOpptjentIPeriode(inntektsgrunnlag);

    return (
        <div className={cls.element('inntekter-fra-tiltaket-boks')}>
            <Undertittel>
                Inntekter som skal refunderes for{' '}
                {formatterPeriode(tilskuddsgrunnlag.tilskuddFom, tilskuddsgrunnlag.tilskuddTom)}
            </Undertittel>
            <VerticalSpacer rem={1} />
            <Normaltekst>
                Dette er inntekter som er opptjent i perioden. Det vil gjøres en utregning under med sum bruttolønn som
                grunnlag.
            </Normaltekst>
            <VerticalSpacer rem={1} />
            <InntekterOpptjentIPeriodeTabell inntekter={inntektsgrunnlag?.inntekter} />
            <VerticalSpacer rem={1} />
            <Label htmlFor={'inntekterKunFraTiltaket'}>
                Er inntektene som du har huket av for{' '}
                {sumInntekterOpptjent > 0 && <>({formatterPenger(sumInntekterOpptjent)})</>} kun fra tiltaket{' '}
                {tiltakstypeTekst[tilskuddsgrunnlag.tiltakstype]}?
            </Label>
            <p>
                <i>Du skal svare "nei" hvis noen av inntektene er fra f. eks. vanlig lønn eller lønnstilskudd</i>
            </p>
            <div className={cls.element('inntekter-kun-fra-tiltaket')}>
                <RadioPanel
                    name="inntekterKunFraTiltaket"
                    label="Ja"
                    checked={inntekterKunTiltaket === true}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setInntekterKunTiltaket(event.currentTarget.checked);
                        setEndringBruttoLønn(undefined);
                        endreBruttolønn(refusjonId!, true, undefined);
                    }}
                />
                <RadioPanel
                    name="inntekterKunFraTiltaket"
                    label="Nei"
                    checked={inntekterKunTiltaket === false}
                    onChange={(e) => setInntekterKunTiltaket(!e.currentTarget.checked)}
                />
            </div>

            {inntekterKunTiltaket === false && (
                <>
                    <VerticalSpacer rem={1} />
                    <Input
                        bredde={'S'}
                        label={`Skriv inn bruttolønn utbetalt for ${
                            tiltakstypeTekst[tilskuddsgrunnlag.tiltakstype]
                        } perioden`}
                        onChange={(event: any) => {
                            const verdi = event.currentTarget.value;
                            if (verdi.match(/^\d*$/) && verdi <= sumInntekterOpptjent) {
                                setEndringBruttoLønn(parseInt(verdi, 10));
                            }
                        }}
                        onBlur={() => endreBruttolønn(refusjonId!, false, endringBruttoLønn)}
                        value={endringBruttoLønn}
                    />
                </>
            )}
        </div>
    );
};

export default InntekterFraTiltaketSpørsmål;
