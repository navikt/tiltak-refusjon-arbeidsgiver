import { Input, Label, RadioPanel } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { endreBruttolønn, useHentRefusjon } from '../../services/rest-service';
import BEMHelper from '../../utils/bem';
import { formatterPeriode, månedsNavn } from '../../utils/datoUtils';
import { sumInntekterOpptjentIPeriode } from '../../utils/inntekterUtiles';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjon } from '../refusjon';
import InntekterOpptjentIPeriodeTabell from './InntekterOpptjentIPeriodeTabell';

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
    const [endringBruttoLønn, setEndringBruttoLønn] = useState<string>(endretBruttoLønn?.toString() ?? '');

    useEffect(() => {
        setInntekterKunTiltaket(inntekterKunFraTiltaket);
        setEndringBruttoLønn(endretBruttoLønn?.toString() ?? '');
    }, [inntekterKunFraTiltaket, endretBruttoLønn]);

    if (
        inntektsgrunnlag === undefined ||
        !refusjon.harTattStillingTilAlleInntektslinjer ||
        !inntektsgrunnlag?.inntekter?.find((inntekt) => inntekt.erMedIInntektsgrunnlag) ||
        inntektsgrunnlag?.inntekter.filter((inntekt) => inntekt.erOpptjentIPeriode).length < 1
    ) {
        return null;
    }

    const sumInntekterOpptjent: number = sumInntekterOpptjentIPeriode(inntektsgrunnlag);
    const månedNavn = månedsNavn(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);

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
            <InntekterOpptjentIPeriodeTabell inntekter={inntektsgrunnlag?.inntekter} månedsNavn={månedNavn} />
            <VerticalSpacer rem={1} />
            <Label htmlFor={'inntekterKunFraTiltaket'}>
                Er inntektene som du har huket av for{' '}
                {sumInntekterOpptjent > 0 && <>({formatterPenger(sumInntekterOpptjent)})</>} kun opptjent under tiltaket{' '}
                {tiltakstypeTekst[tilskuddsgrunnlag.tiltakstype]}?
            </Label>
            <p>
                <i>Du skal svare "nei" hvis noen av inntektene er fra f. eks. vanlig lønn eller et annet tiltak.</i>
            </p>
            <div className={cls.element('inntekter-kun-fra-tiltaket')}>
                <RadioPanel
                    name="inntekterKunFraTiltaket"
                    label="Ja"
                    checked={inntekterKunTiltaket === true}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setInntekterKunTiltaket(event.currentTarget.checked);
                        setEndringBruttoLønn('');
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
                        label={`Skriv inn bruttolønn utbetalt for perioden med ${
                            tiltakstypeTekst[tilskuddsgrunnlag.tiltakstype]
                        }`}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const verdi: string = event.currentTarget.value;
                            if (verdi.match(/^\d*$/) && parseInt(verdi, 10) <= sumInntekterOpptjent) {
                                setEndringBruttoLønn(verdi);
                            }
                        }}
                        onBlur={() => endreBruttolønn(refusjonId!, false, parseInt(endringBruttoLønn, 10))}
                        value={endringBruttoLønn}
                    />
                </>
            )}
        </div>
    );
};

export default InntekterFraTiltaketSpørsmål;
