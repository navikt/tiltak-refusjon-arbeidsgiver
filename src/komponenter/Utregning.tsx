import { ReactComponent as Bygg } from '@/asset/image/bygg.svg';
import { ReactComponent as Endret } from '@/asset/image/endret.svg';
import { ReactComponent as ErlikTegn } from '@/asset/image/erlikTegn.svg';
import { ReactComponent as MinusTegn } from '@/asset/image/minusTegn.svg';
import { ReactComponent as Pengesekken } from '@/asset/image/pengesekkdollar.svg';
import { ReactComponent as PlussTegn } from '@/asset/image/plussTegn.svg';
import { ReactComponent as ProsentTegn } from '@/asset/image/prosentTegn.svg';
import { ReactComponent as RefusjonAvLønn } from '@/asset/image/refusjonAvLønn.svg';
import { ReactComponent as Sparegris } from '@/asset/image/sparegris.svg';
import { ReactComponent as Stillingsprosent } from '@/asset/image/stillingsprosent.svg';
import { ReactComponent as Stranden } from '@/asset/image/strand.svg';
import { Alert, Heading } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Beregning, Inntektsgrunnlag, Tilskuddsgrunnlag } from '../refusjon/refusjon';
import { formatterPenger } from '../utils/PengeUtils';
import EksternLenke from './EksternLenke/EksternLenke';
import Utregningsrad from './Utregningsrad';
import VerticalSpacer from './VerticalSpacer';

interface Props {
    beregning?: Beregning;
    tilskuddsgrunnlag: Tilskuddsgrunnlag;
    forrigeRefusjonMinusBeløp?: number;
    inntektsgrunnlag?: Inntektsgrunnlag;
}

const GråRamme = styled.div`
    border: 4px solid #eee;
    border-radius: 4px;
    padding: 1.5rem;
    margin-bottom: 4rem;
`;

const Utregning: FunctionComponent<Props> = (props) => {
    const { beregning, tilskuddsgrunnlag, forrigeRefusjonMinusBeløp } = props;
    const bruttoLønnsInntekter = props.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.erMedIInntektsgrunnlag && inntekt.erOpptjentIPeriode === true
    );
    const ferietrekkInntekter = props.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.beskrivelse === 'trekkILoennForFerie'
    );

    return (
        <GråRamme>
            <Heading size="medium">Utregningen</Heading>
            <VerticalSpacer rem={1} />
            <Utregningsrad
                labelIkon={<Pengesekken />}
                labelTekst={'Bruttolønn i perioden'}
                verdi={beregning?.lønn || 0}
                inntekter={bruttoLønnsInntekter}
            />
            {beregning && beregning.fratrekkLønnFerie !== 0 && (
                <Utregningsrad
                    labelIkon={<Endret />}
                    labelTekst="Fratrekk for ferie (hentet fra A-meldingen)"
                    verdiOperator={beregning.fratrekkLønnFerie < 0 ? <MinusTegn /> : <PlussTegn />}
                    verdi={
                        beregning.fratrekkLønnFerie < 0 ? beregning.fratrekkLønnFerie * -1 : beregning.fratrekkLønnFerie
                    }
                    inntekter={ferietrekkInntekter}
                    tilskuddsgunnlag={props.tilskuddsgrunnlag}
                />
            )}

            <>
                <Utregningsrad
                    labelIkon={<Stranden />}
                    labelTekst="Feriepenger"
                    labelSats={props.tilskuddsgrunnlag.feriepengerSats}
                    verdiOperator={<PlussTegn />}
                    verdi={beregning?.feriepenger || 0}
                />
                <Utregningsrad
                    labelIkon={<Sparegris />}
                    labelTekst="Innskudd obligatorisk tjenestepensjon"
                    labelSats={props.tilskuddsgrunnlag.otpSats}
                    verdiOperator={<PlussTegn />}
                    verdi={beregning?.tjenestepensjon || 0}
                />
                <Utregningsrad
                    labelIkon={<Bygg />}
                    labelTekst="Arbeidsgiveravgift"
                    labelSats={props.tilskuddsgrunnlag.arbeidsgiveravgiftSats}
                    verdiOperator={<PlussTegn />}
                    verdi={beregning?.arbeidsgiveravgift || 0}
                    border={beregning && beregning?.tidligereRefundertBeløp > 0 ? 'TYKK' : undefined}
                />
                {beregning && beregning?.tidligereRefundertBeløp > 0 ? (
                    <>
                        <Utregningsrad
                            labelIkon={<Pengesekken />}
                            labelTekst="Sum brutto lønnsutgifter"
                            verdiOperator={<ErlikTegn />}
                            verdi={beregning?.sumUtgifter || 0}
                        />
                        <Utregningsrad
                            labelIkon={<Endret />}
                            labelTekst="Refunderbar lønn"
                            verdiOperator={<MinusTegn />}
                            verdi={beregning?.tidligereRefundertBeløp}
                        />
                        <Utregningsrad
                            labelIkon={<Pengesekken />}
                            labelTekst="Refusjonsgrunnlag"
                            verdiOperator={<ErlikTegn />}
                            verdi={beregning?.sumUtgifterFratrukketRefundertBeløp}
                            border="TYKK"
                        />
                    </>
                ) : (
                    <Utregningsrad
                        labelIkon={<Pengesekken />}
                        labelTekst="Refusjonsgrunnlag"
                        verdiOperator={<ErlikTegn />}
                        verdi={beregning?.sumUtgifter || 0}
                        border="TYKK"
                    />
                )}
                <Utregningsrad
                    labelIkon={<Stillingsprosent />}
                    labelTekst="Tilskuddsprosent"
                    verdiOperator={<ProsentTegn />}
                    ikkePenger
                    verdi={tilskuddsgrunnlag.lønnstilskuddsprosent}
                />
            </>

            <VerticalSpacer rem={3} />
            {beregning && (beregning.overTilskuddsbeløp || beregning.tidligereUtbetalt > 0) && (
                <Utregningsrad
                    labelIkon={<Pengesekken />}
                    labelTekst="Beregning basert på innhentede innteker"
                    verdiOperator={<ErlikTegn />}
                    verdi={beregning.beregnetBeløp}
                    border="TYKK"
                />
            )}
            {beregning && beregning.overTilskuddsbeløp && beregning.tidligereUtbetalt > 0 && (
                <Utregningsrad
                    labelIkon={<Pengesekken />}
                    labelTekst="Tilskuddsbeløp (avtalt beløp for perioden)"
                    verdi={props.tilskuddsgrunnlag.tilskuddsbeløp}
                    border="TYKK"
                />
            )}
            {beregning && beregning.tidligereUtbetalt > 0 && (
                <Utregningsrad
                    labelIkon={<Endret />}
                    labelTekst="Tidligere utbetalt"
                    verdiOperator={<MinusTegn />}
                    verdi={beregning.tidligereUtbetalt}
                    border="TYKK"
                />
            )}
            {forrigeRefusjonMinusBeløp != null && forrigeRefusjonMinusBeløp < 0 && (
                <Utregningsrad
                    labelIkon={<Endret />}
                    labelTekst={'Resterende fratrekk for ferie fra tidligere refusjoner'}
                    verdiOperator={<MinusTegn />}
                    verdi={forrigeRefusjonMinusBeløp}
                    border="TYKK"
                />
            )}
            {props.beregning?.tidligereUtbetalt != null && props.beregning?.tidligereUtbetalt < 0 && (
                <Utregningsrad
                    labelTekst="Tidligere utbetalt"
                    verdiOperator={<ErlikTegn />}
                    verdi={props.beregning?.tidligereUtbetalt ?? 0}
                    ikkePenger={props.beregning === undefined}
                    border="TYKK"
                />
            )}
            <Utregningsrad
                labelIkon={<RefusjonAvLønn />}
                labelTekst="Refusjonsbeløp"
                verdiOperator={<ErlikTegn />}
                verdi={beregning?.refusjonsbeløp ?? 'kan ikke beregne'}
                ikkePenger={beregning === undefined}
                border="TYKK"
            />
            <VerticalSpacer rem={1} />
            {beregning?.overFemGrunnbeløp && (
                <Alert variant="warning" size="small">
                    Refusjonen har nå oversteget fem ganger grunnbeløpet per år. Det vil bli utbetalt{' '}
                    {formatterPenger(beregning?.refusjonsbeløp)} for denne perioden. Refusjonen for resten av året vil
                    settes til 0 kr, men dere må fortsatt sende inn refusjoner hver måned.
                    <br />{' '}
                    <EksternLenke href="https://lovdata.no/dokument/SF/forskrift/2015-12-11-1598/KAPITTEL_10#KAPITTEL_10">
                        Forskrift om arbeidsmarkedstiltak (tiltaksforskriften) - Kapittel 10. Varig lønnstilskudd
                    </EksternLenke>
                </Alert>
            )}
            {beregning?.overTilskuddsbeløp && !beregning?.overFemGrunnbeløp && (
                <Alert variant="warning" size="small">
                    Beregnet beløp er høyere enn refusjonsbeløpet. Avtalt beløp er inntil{' '}
                    {formatterPenger(tilskuddsgrunnlag.tilskuddsbeløp)} for denne perioden. Lønn i denne
                    refusjonsperioden kan ikke endres og dere vil få utbetalt maks av avtalt beløp.
                </Alert>
            )}
        </GråRamme>
    );
};

export default Utregning;
