import { ReactComponent as Bygg } from '@/asset/image/bygg.svg';
import { ReactComponent as ErlikTegn } from '@/asset/image/erlikTegn.svg';
import { ReactComponent as MinusTegn } from '@/asset/image/minusTegn.svg';
import { ReactComponent as Pengesekken } from '@/asset/image/pengesekkdollar.svg';
import { ReactComponent as PlussTegn } from '@/asset/image/plussTegn.svg';
import { ReactComponent as ProsentTegn } from '@/asset/image/prosentTegn.svg';
import { ReactComponent as Sparegris } from '@/asset/image/sparegris.svg';
import { ReactComponent as Stranden } from '@/asset/image/strand.svg';
import { ReactComponent as Sykepenger } from '@/asset/image/sykepenger.svg';
import { ReactComponent as Stillingsprosent } from '@/asset/image/stillingsprosent.svg';
import { ReactComponent as RefusjonAvLønn } from '@/asset/image/refusjonAvLønn.svg';
import { ReactComponent as Endret } from '@/asset/image/endret.svg';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Systemtittel } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Beregning, Tilskuddsgrunnlag } from '../refusjon/refusjon';
import { formatterPenger } from '../utils/PengeUtils';
import Utregningsrad from './Utregningsrad';
import VerticalSpacer from './VerticalSpacer';

interface Props {
    beregning?: Beregning;
    tilskuddsgrunnlag: Tilskuddsgrunnlag;
}

const GråRamme = styled.div`
    border: 4px solid #eee;
    border-radius: 4px;
    padding: 1.5rem;
    margin-bottom: 4rem;
`;

const Utregning: FunctionComponent<Props> = (props) => {
    const { beregning, tilskuddsgrunnlag } = props;
    return (
        <GråRamme>
            <Systemtittel>Utregningen</Systemtittel>
            <VerticalSpacer rem={1} />
            <Utregningsrad
                labelIkon={<Pengesekken />}
                labelTekst={'Brutto lønn i perioden'}
                verdi={beregning?.lønn || 0}
            />
            {beregning && beregning?.fratrekkLonnSykepenger > 0 && (
                <Utregningsrad
                    labelIkon={<Sykepenger />}
                    labelTekst="fratrekk for sykepenger"
                    verdiOperator={<MinusTegn />}
                    verdi={beregning?.fratrekkLonnSykepenger}
                />
            )}
            {beregning && beregning.fratrekkLønnFerie > 0 && (
                <Utregningsrad
                    labelIkon={<Endret />}
                    labelTekst="fratrekk for ferie"
                    verdiOperator={<MinusTegn />}
                    verdi={beregning.fratrekkLønnFerie}
                />
            )}
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
            />
            <Utregningsrad
                labelIkon={<Pengesekken />}
                labelTekst="Refusjonsgrunnlag"
                verdiOperator={<ErlikTegn />}
                verdi={beregning?.sumUtgifter || 0}
            />
            <Utregningsrad
                labelIkon={<Stillingsprosent />}
                labelTekst="Tilskuddsprosent"
                verdiOperator={<ProsentTegn />}
                ikkePenger
                verdi={tilskuddsgrunnlag.lønnstilskuddsprosent}
            />
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

            <Utregningsrad
                labelIkon={<RefusjonAvLønn />}
                labelTekst="Refusjonsbeløp"
                verdiOperator={<ErlikTegn />}
                verdi={beregning?.refusjonsbeløp ?? 'kan ikke beregne'}
                ikkePenger={beregning === undefined}
                border="TYKK"
            />
            <VerticalSpacer rem={1} />
            {beregning?.overTilskuddsbeløp && (
                <AlertStripeAdvarsel>
                    Beregnet beløp er høyere enn refusjonsbeløpet. Avtalt beløp er inntil{' '}
                    {formatterPenger(tilskuddsgrunnlag.tilskuddsbeløp)} for denne perioden. Lønn i denne
                    refusjonsperioden kan ikke endres og dere vil få utbetalt maks av avtalt beløp.
                </AlertStripeAdvarsel>
            )}
        </GråRamme>
    );
};

export default Utregning;
