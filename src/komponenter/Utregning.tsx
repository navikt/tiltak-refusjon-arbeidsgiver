import Bygg from '@/asset/image/bygg.svg?react';
import { BankNoteIcon, PercentIcon } from '@navikt/aksel-icons';
import Endret from '@/asset/image/endret.svg?react';
import ErlikTegn from '@/asset/image/erlikTegn.svg?react';
import MinusTegn from '@/asset/image/minusTegn.svg?react';
import Pengesekken from '@/asset/image/pengesekkdollar.svg?react';
import PlussTegn from '@/asset/image/plussTegn.svg?react';
import ProsentTegn from '@/asset/image/prosentTegn.svg?react';
import Sparegris from '@/asset/image/sparegris.svg?react';
import Stranden from '@/asset/image/strand.svg?react';
import { BodyShort, Heading, ReadMore } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import { Beregning, Inntektsgrunnlag, Tilskuddsgrunnlag } from '../refusjon/refusjon';
import { formatterPenger } from '../utils/PengeUtils';
import EksternLenke from './EksternLenke/EksternLenke';
import Utregningsrad from './Utregningsrad';
import VerticalSpacer from './VerticalSpacer';
import UtregningsradHvaInngårIDette from './UtregningsradHvaInngårIDette';
import BEMHelper from '@/utils/bem';
import './Utregning.less';

interface Props {
    refusjonsnummer: {
        avtalenr: number;
        løpenummer: number;
    };
    beregning?: Beregning;
    tilskuddsgrunnlag: Tilskuddsgrunnlag;
    forrigeRefusjonMinusBeløp?: number;
    inntektsgrunnlag?: Inntektsgrunnlag;
    sumUtbetaltVarig?: number;
}

const Utregning: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper('utregning');

    const { beregning, tilskuddsgrunnlag, forrigeRefusjonMinusBeløp } = props;
    const bruttoLønnsInntekter = props.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.erMedIInntektsgrunnlag && inntekt.erOpptjentIPeriode === true
    );
    const ferietrekkInntekter = props.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.beskrivelse === 'trekkILoennForFerie'
    );

    const harMinusBeløp = forrigeRefusjonMinusBeløp != null && forrigeRefusjonMinusBeløp < 0;
    const refusjonsnummer = props.refusjonsnummer.avtalenr + '-' + props.refusjonsnummer.løpenummer;
    const beløpOverMaks = beregning && beregning.overTilskuddsbeløp;
    const beløpOver5G = beregning?.overFemGrunnbeløp;
    const erKorreksjon = beregning?.tidligereUtbetalt !== 0;

    const tilUtbetaling = (tykkBunn: boolean) => (
        <Utregningsrad
            labelIkon={<BankNoteIcon />}
            labelTekst={'Refusjonsbeløp til utbetaling'}
            verdiOperator={<ErlikTegn />}
            verdi={(beregning?.refusjonsbeløp || 0) ?? 'kan ikke beregne'}
            ikkePenger={beregning === undefined}
            border={tykkBunn ? 'TYKK' : 'INGEN'}
        />
    );

    return (
        <div className={cls.className}>
            <Heading level="3" size="medium">
                Utregningen
            </Heading>
            <VerticalSpacer rem={1} />
            <Utregningsrad labelTekst={'Bruttolønn i perioden'} verdi={beregning?.lønn || 0}>
                <UtregningsradHvaInngårIDette
                    inntekter={bruttoLønnsInntekter || []}
                    tilskuddsgrunnlag={props.tilskuddsgrunnlag}
                />
            </Utregningsrad>
            {beregning && beregning.fratrekkLønnFerie !== 0 && (
                <Utregningsrad
                    labelIkon={<Stranden />}
                    labelTekst="Fratrekk for ferie (hentet fra A-meldingen)"
                    verdiOperator={beregning.fratrekkLønnFerie < 0 ? <MinusTegn /> : <PlussTegn />}
                    verdi={
                        beregning.fratrekkLønnFerie < 0 ? beregning.fratrekkLønnFerie * -1 : beregning.fratrekkLønnFerie
                    }
                >
                    <UtregningsradHvaInngårIDette
                        inntekter={ferietrekkInntekter || []}
                        tilskuddsgrunnlag={props.tilskuddsgrunnlag}
                    />
                </Utregningsrad>
            )}

            <>
                <Utregningsrad
                    labelIkon={<Stranden />}
                    labelTekst="Feriepenger"
                    labelSats={props.tilskuddsgrunnlag.feriepengerSats}
                    verdiOperator={(beregning?.feriepenger || 0) >= 0 ? <PlussTegn /> : <MinusTegn />}
                    verdi={Math.abs(beregning?.feriepenger || 0)}
                />
                <Utregningsrad
                    labelIkon={<Sparegris />}
                    labelTekst="Innskudd obligatorisk tjenestepensjon"
                    labelSats={props.tilskuddsgrunnlag.otpSats}
                    verdiOperator={(beregning?.tjenestepensjon || 0) >= 0 ? <PlussTegn /> : <MinusTegn />}
                    verdi={Math.abs(beregning?.tjenestepensjon || 0)}
                />
                <Utregningsrad
                    labelIkon={<Bygg />}
                    labelTekst="Arbeidsgiveravgift"
                    labelSats={props.tilskuddsgrunnlag.arbeidsgiveravgiftSats}
                    verdiOperator={(beregning?.arbeidsgiveravgift || 0) >= 0 ? <PlussTegn /> : <MinusTegn />}
                    verdi={Math.abs(beregning?.arbeidsgiveravgift || 0)}
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
                            className={cls.element('grå-utregningsrad')}
                            labelTekst="Refusjonsgrunnlag"
                            verdiOperator={<ErlikTegn />}
                            verdi={beregning?.sumUtgifterFratrukketRefundertBeløp}
                            border="TYKK"
                        />
                    </>
                ) : (
                    <Utregningsrad
                        className={cls.element('grå-utregningsrad')}
                        labelTekst="Refusjonsgrunnlag"
                        verdiOperator={<ErlikTegn />}
                        verdi={beregning?.sumUtgifter || 0}
                        border="TYKK"
                    />
                )}
                <Utregningsrad
                    labelIkon={<PercentIcon />}
                    labelTekst="Tilskuddsprosent"
                    verdiOperator={<ProsentTegn />}
                    ikkePenger
                    verdi={tilskuddsgrunnlag.lønnstilskuddsprosent}
                />
            </>

            <VerticalSpacer rem={2} />
            {beregning && (beregning.overTilskuddsbeløp || beregning.tidligereUtbetalt > 0 || harMinusBeløp) && (
                <Utregningsrad
                    utgår={beløpOverMaks}
                    labelTekst={
                        <>
                            Beregning basert på innhentede inntekter
                            {beløpOverMaks ? <b> UTGÅR</b> : null}
                        </>
                    }
                    verdiOperator={<ErlikTegn />}
                    border={erKorreksjon ? 'INGEN' : 'NORMAL'}
                    verdi={beregning.beregnetBeløp}
                >
                    {beløpOverMaks && (
                        <ReadMore size="small" header="Hva betyr dette?">
                            {beløpOver5G && (
                                <>
                                    <BodyShort size="small">
                                        Avtalen har nå oversteget fem ganger grunnbeløpet per år.{' '}
                                        <b>
                                            Det vil bli utbetalt {formatterPenger(beregning?.refusjonsbeløp)} for denne
                                            perioden.
                                        </b>{' '}
                                        Refusjoner for resten av året vil settes til 0 kr, men dere må fortsatt sende
                                        inn refusjoner hver måned.
                                    </BodyShort>
                                    <BodyShort size="small">
                                        <EksternLenke href="https://lovdata.no/forskrift/2015-12-11-1598/§10-7">
                                            Forskrift om arbeidsmarkedstiltak (tiltaksforskriften) - Kapittel 10. Varig
                                            lønnstilskudd
                                        </EksternLenke>
                                    </BodyShort>
                                </>
                            )}
                            {!beløpOver5G && (
                                <BodyShort size="small">
                                    Beregnet beløp er høyere enn refusjonsbeløpet.{' '}
                                    <b>
                                        Avtalt beløp er inntil {formatterPenger(props.tilskuddsgrunnlag.tilskuddsbeløp)}{' '}
                                        for denne perioden.
                                    </b>{' '}
                                    Lønn i denne refusjonsperioden kan ikke endres og dere vil få utbetalt maks av
                                    avtalt beløp.
                                </BodyShort>
                            )}
                        </ReadMore>
                    )}
                </Utregningsrad>
            )}
            {erKorreksjon && (
                <div className={beløpOverMaks ? cls.element('korreksjons-oppsummering') : ''}>
                    {beløpOverMaks && beregning && beregning.tidligereUtbetalt !== 0 && (
                        <Utregningsrad
                            labelIkon={<Pengesekken />}
                            labelTekst="Avtalt tilskuddsbeløp brukes som beregningsgrunnlag"
                            verdiOperator={<ErlikTegn />}
                            verdi={props.tilskuddsgrunnlag.tilskuddsbeløp}
                            border="INGEN"
                        />
                    )}
                    {harMinusBeløp && (
                        <Utregningsrad
                            labelIkon={<Endret />}
                            labelTekst={'Resterende fratrekk for ferie fra tidligere refusjoner'}
                            verdiOperator={<MinusTegn />}
                            verdi={forrigeRefusjonMinusBeløp}
                            border="INGEN"
                        />
                    )}
                    {props.beregning?.tidligereUtbetalt != null && props.beregning?.tidligereUtbetalt !== 0 && (
                        <Utregningsrad
                            labelTekst={'Opprinnelig refusjonsbeløp fra refusjonsnummer ' + refusjonsnummer}
                            verdiOperator={props.beregning?.tidligereUtbetalt > 0 ? <MinusTegn /> : <PlussTegn />}
                            verdi={Math.abs(props.beregning?.tidligereUtbetalt ?? 0)}
                            ikkePenger={props.beregning === undefined}
                            border="INGEN"
                        >
                            {props.beregning?.tidligereUtbetalt < 0 && (
                                <ReadMore size="small" header="Hva betyr dette?">
                                    <BodyShort size="small">
                                        Den opprinnelige refusjonen medførte et trekk på
                                        {formatterPenger(Math.abs(props.beregning?.tidligereUtbetalt))}; dette
                                        kompenseres for i denne beregningen.
                                    </BodyShort>
                                </ReadMore>
                            )}
                            {props.beregning?.tidligereUtbetalt >= 0 && (
                                <ReadMore size="small" header="Hva betyr dette?">
                                    <BodyShort size="small">
                                        Den opprinnelige refusjonen medførte en utbetaling på
                                        {formatterPenger(Math.abs(props.beregning?.tidligereUtbetalt))}; dette trekkes
                                        fra denne beregningen.
                                    </BodyShort>
                                </ReadMore>
                            )}
                        </Utregningsrad>
                    )}
                    {tilUtbetaling(false)}
                </div>
            )}
            {beregning?.tidligereUtbetalt === 0 && (
                <>
                    {beløpOverMaks && beregning && beregning.tidligereUtbetalt !== 0 && (
                        <Utregningsrad
                            labelIkon={<Pengesekken />}
                            labelTekst="Avtalt tilskuddsbeløp brukes som beregningsgrunnlag"
                            verdiOperator={<ErlikTegn />}
                            verdi={props.tilskuddsgrunnlag.tilskuddsbeløp}
                            border="INGEN"
                        />
                    )}
                    {tilUtbetaling(true)}
                </>
            )}
        </div>
    );
};

export default Utregning;
