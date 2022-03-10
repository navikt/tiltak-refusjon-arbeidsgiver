import { ReactComponent as Bygg } from '@/asset/image/bygg.svg';
import { ReactComponent as ErlikTegn } from '@/asset/image/erlikTegn.svg';
import { ReactComponent as MinusTegn } from '@/asset/image/minusTegn.svg';
import { ReactComponent as Pengesekken } from '@/asset/image/pengesekkdollar.svg';
import { ReactComponent as PlussTegn } from '@/asset/image/plussTegn.svg';
import { ReactComponent as ProsentTegn } from '@/asset/image/prosentTegn.svg';
import { ReactComponent as Sparegris } from '@/asset/image/sparegris.svg';
import { ReactComponent as Stranden } from '@/asset/image/strand.svg';
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
`;

const Utregning: FunctionComponent<Props> = (props) => {
    return (
        <GråRamme>
            <Systemtittel>Utregningen</Systemtittel>
            <VerticalSpacer rem={1} />
            <Utregningsrad
                labelIkon={<Pengesekken />}
                labelTekst={'Brutto lønn i perioden'}
                verdi={props.beregning?.lønn || 0}
            />
            {props.beregning && props.beregning.fratrekkLønnFerie > 0 && (
                <>
                    <Utregningsrad
                        labelTekst="fratrekk for ferie"
                        verdiOperator={<MinusTegn />}
                        verdi={props.beregning.fratrekkLønnFerie}
                    />
                    <Utregningsrad
                        labelTekst="Lønn trukket fra ferie"
                        verdiOperator={<ErlikTegn />}
                        verdi={props.beregning.lønnFratrukketFerie}
                    />
                </>
            )}
            <Utregningsrad
                labelIkon={<Stranden />}
                labelTekst="Feriepenger"
                labelSats={props.tilskuddsgrunnlag.feriepengerSats}
                verdiOperator={<PlussTegn />}
                verdi={props.beregning?.feriepenger || 0}
            />
            <Utregningsrad
                labelIkon={<Sparegris />}
                labelTekst="Innskudd obligatorisk tjenestepensjon"
                labelSats={props.tilskuddsgrunnlag.otpSats}
                verdiOperator={<PlussTegn />}
                verdi={props.beregning?.tjenestepensjon || 0}
            />
            <Utregningsrad
                labelIkon={<Bygg />}
                labelTekst="Arbeidsgiveravgift"
                labelSats={props.tilskuddsgrunnlag.arbeidsgiveravgiftSats}
                verdiOperator={<PlussTegn />}
                verdi={props.beregning?.arbeidsgiveravgift || 0}
            />
            <Utregningsrad
                labelTekst="Refusjonsgrunnlag"
                verdiOperator={<ErlikTegn />}
                verdi={props.beregning?.sumUtgifter || 0}
            />
            <Utregningsrad
                labelTekst="Tilskuddsprosent"
                verdiOperator={<ProsentTegn />}
                ikkePenger
                verdi={props.tilskuddsgrunnlag.lønnstilskuddsprosent}
            />
            <VerticalSpacer rem={3} />
            {props.beregning && (props.beregning.overTilskuddsbeløp || props.beregning.tidligereUtbetalt > 0) && (
                <Utregningsrad
                    labelTekst="Beregning basert på innhentede innteker"
                    verdiOperator={<ErlikTegn />}
                    verdi={props.beregning.beregnetBeløp}
                    border="TYKK"
                />
            )}
            {props.beregning && props.beregning.overTilskuddsbeløp && props.beregning.tidligereUtbetalt > 0 && (
                <Utregningsrad
                    labelTekst="Tilskuddsbeløp (avtalt beløp for perioden)"
                    verdi={props.tilskuddsgrunnlag.tilskuddsbeløp}
                    border="TYKK"
                />
            )}
            {props.beregning && props.beregning.tidligereUtbetalt > 0 && (
                <Utregningsrad
                    labelTekst="Tidligere utbetalt"
                    verdiOperator={<MinusTegn />}
                    verdi={props.beregning.tidligereUtbetalt}
                    border="TYKK"
                />
            )}

            <Utregningsrad
                labelTekst="Refusjonsbeløp"
                verdiOperator={<ErlikTegn />}
                verdi={props.beregning?.refusjonsbeløp ?? 'kan ikke beregne'}
                ikkePenger={props.beregning === undefined}
                border="TYKK"
            />
            <VerticalSpacer rem={1} />
            {props.beregning?.overTilskuddsbeløp && (
                <AlertStripeAdvarsel>
                    Beregnet beløp er høyere enn refusjonsbeløpet. Avtalt beløp er inntil{' '}
                    {formatterPenger(props.tilskuddsgrunnlag.tilskuddsbeløp)} for denne perioden. Lønn i denne
                    refusjonsperioden kan ikke endres og dere vil få utbetalt maks av avtalt beløp.
                </AlertStripeAdvarsel>
            )}
        </GråRamme>
    );
};

export default Utregning;
