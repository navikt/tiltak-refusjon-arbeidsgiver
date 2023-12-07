import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { endreBruttolønn, useHentRefusjon } from '../../services/rest-service';
import BEMHelper from '../../utils/bem';
import { formatterPeriode, månedsNavn } from '../../utils/datoUtils';
import { sumInntekterOpptjentIPeriode } from '../../utils/inntekterUtiles';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjon } from '../refusjon';
import InntekterOpptjentIPeriodeTabell from './InntekterOpptjentIPeriodeTabell';
import { BodyShort, Heading, Label, Radio, RadioGroup, TextField, debounce } from '@navikt/ds-react';

const InntekterFraTiltaketSpørsmål: FunctionComponent = () => {
    const cls = BEMHelper('refusjonside');
    const { refusjonId } = useParams();
    const refusjon: Refusjon = useHentRefusjon(refusjonId);
    const { inntektsgrunnlag, tilskuddsgrunnlag, inntekterKunFraTiltaket, endretBruttoLønn } =
        refusjon.refusjonsgrunnlag;
    const [inntekterKunTiltaket, setInntekterKunTiltaket] = useState<boolean | undefined>(inntekterKunFraTiltaket);
    const [endringBruttoLønn, setEndringBruttoLønn] = useState<string>(endretBruttoLønn?.toString() ?? '');

    const refusjonNummer = `${tilskuddsgrunnlag.avtaleNr}-${tilskuddsgrunnlag.løpenummer}`;
    const periode = (formatterPeriode(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom, refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom, 'DD.MM'));

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

    const ANTALL_MILLISEKUNDER = 100;
    const delayEndreBruttolønn = debounce(endreBruttolønn, ANTALL_MILLISEKUNDER);

    const sumInntekterOpptjent: number = sumInntekterOpptjentIPeriode(inntektsgrunnlag);
    const månedNavn = månedsNavn(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);
    
    return (
        <div className={cls.element('inntekter-fra-tiltaket-boks')}>
            <Heading size="small">
                Inntekter som skal refunderes for{' '}
                {formatterPeriode(tilskuddsgrunnlag.tilskuddFom, tilskuddsgrunnlag.tilskuddTom)}
            </Heading>
            <VerticalSpacer rem={1} />
            <BodyShort size="small">
                Dette er inntekter som er opptjent i perioden. Det vil gjøres en utregning under med sum bruttolønn som
                grunnlag.
            </BodyShort>
            <VerticalSpacer rem={1} />
            <InntekterOpptjentIPeriodeTabell inntekter={inntektsgrunnlag?.inntekter} månedsNavn={månedNavn} />
            <VerticalSpacer rem={1}/>
            <Label htmlFor={'inntekterKunFraTiltaket'}>
            Er inntektene du har huket av {' '}{sumInntekterOpptjent > 0 && <>({formatterPenger(sumInntekterOpptjent)})</>} 
            {' '}tilknyttet refusjonssnummer {refusjonNummer} for perioden {periode} for tiltaket {tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]} ?
            </Label>
            <p>
                <i>Du skal svare ja hvis perioden og bruttolønn samsvarer.</i>
            </p>
            <p>
                <i>Du skal svare nei hvis inntekter skal brukes i andre refusjoner tilknyttet andre tilskuddsperioder eller bruttolønn blir høyere.</i>
            </p>
            <RadioGroup legend="" className={cls.element('inntekter-kun-fra-tiltaket')} value={inntekterKunTiltaket}>
                <Radio
                    name="inntekterKunFraTiltaket"
                    value={true}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setInntekterKunTiltaket(event.currentTarget.checked);
                        setEndringBruttoLønn('');
                        delayEndreBruttolønn(refusjonId!, true, refusjon.sistEndret, undefined);
                    }}
                >
                    Ja
                </Radio>
                <Radio
                    name="inntekterKunFraTiltaket"
                    value={false}
                    onChange={(e) => setInntekterKunTiltaket(!e.currentTarget.checked)}
                >
                    Nei
                </Radio>
            </RadioGroup>

            {inntekterKunTiltaket === false && (
                <>
                    <VerticalSpacer rem={1} />
                    <TextField
                        className={cls.element('bruttolønn-utbetalt-for-periode')}
                        size="small"
                        label={`Skriv inn bruttolønn utbetalt for perioden med ${
                            tiltakstypeTekst[tilskuddsgrunnlag.tiltakstype]
                        }`}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const verdi: string = event.currentTarget.value;
                            if (verdi.match(/^\d*$/) && parseInt(verdi, 10) <= sumInntekterOpptjent) {
                                setEndringBruttoLønn(verdi);
                            }
                            if (!verdi) {
                                setEndringBruttoLønn('');
                            }
                        }}
                        onBlur={() => delayEndreBruttolønn(refusjonId!, false, refusjon.sistEndret, parseInt(endringBruttoLønn, 10))}
                        value={endringBruttoLønn}
                    />
                </>
            )}
        </div>
    );
};

export default InntekterFraTiltaketSpørsmål;
