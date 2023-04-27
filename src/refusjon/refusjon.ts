import { RefusjonStatus } from './status';
import { Tiltak } from './tiltak';

export enum KorreksjonStatus {
    UTKAST = 'UTKAST',
    TILLEGSUTBETALING = 'TILLEGSUTBETALING',
    OPPGJORT = 'OPPGJORT',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export enum SortingOrder {
    DELTAKER_ASC = 'DELTAKER_ASC',
    DELTAKER_DESC = 'DELTAKER_DESC',
    PERIODE_ASC = 'PERIODE_ASC',
    PERIODE_DESC = 'PERIODE_DESC',
    STATUS_ASC = 'STATUS_ASC',
    STATUS_DESC = 'STATUS_DESC',
    FRISTFORGODKJENNING_ASC = 'FRISTFORGODKJENNING_ASC',
    FRISTFORGODKJENNING_DESC = 'FRISTFORGODKJENNING_DESC',
}

export interface PageableRefusjon {
    currentPage: number;
    refusjoner: Array<Refusjon>;
    size: number;
    totalItems: number;
    totalPages: number;
}

export interface Refusjon {
    id: string;
    bedriftNr: string;
    deltakerFnr: string;
    godkjentAvArbeidsgiver?: string;
    status: RefusjonStatus;
    forrigeFristForGodkjenning?: string;
    fristForGodkjenning: string;
    harInntektIAlleMåneder: boolean;
    harTattStillingTilAlleInntektslinjer: boolean;
    korreksjonId?: string;
    refusjonsgrunnlag: Refusjonsgrunnlag;
    utbetaltTidspunkt?: string;
    unntakOmInntekterToMånederFrem: boolean;
    forrigeRefusjonSomSkalSendesFørst?: Refusjon;
}

export interface Korreksjon {
    id: string;
    korrigererRefusjonId: string;
    bedriftNr: string;
    deltakerFnr: string;
    status: KorreksjonStatus;
    harInntektIAlleMåneder: boolean;
    kostnadssted?: string;
    korreksjonsgrunner: Korreksjonsgrunn[];
    refusjonsgrunnlag: Refusjonsgrunnlag;
    godkjentTidspunkt?: string;
}

export interface Refusjonsgrunnlag {
    tilskuddsgrunnlag: Tilskuddsgrunnlag;
    inntektsgrunnlag?: Inntektsgrunnlag;
    inntekterKunFraTiltaket?: boolean;
    fratrekkRefunderbarBeløp?: boolean;
    endretBruttoLønn?: number;
    bedriftKontonummer?: string;
    bedriftKid?: string;

    beregning?: Beregning;
    forrigeRefusjonMinusBeløp: number;
}

export interface Tilskuddsgrunnlag {
    arbeidsgiveravgiftSats: number;
    avtaleId: string;
    avtaleNr: number;
    løpenummer: number;
    bedriftNavn: string;
    bedriftNr: string;
    deltakerEtternavn: string;
    deltakerFnr: string;
    deltakerFornavn: string;
    arbeidsgiverFornavn: string;
    arbeidsgiverEtternavn: string;
    arbeidsgiverTlf: string;
    feriepengerSats: number;
    id: string;
    lønnstilskuddsprosent: number;
    otpSats: number;
    tilskuddFom: string;
    tilskuddTom: string;
    tilskuddsbeløp: number;
    tilskuddsperiodeId: string;
    tiltakstype: Tiltak;
    veilederNavIdent: string;
    enhet: string;
}

export interface Inntektsgrunnlag {
    innhentetTidspunkt: string;
    inntekter: Inntektslinje[];
    bruttoLønn: number;
}

export interface Inntektslinje {
    inntektType: string;
    beskrivelse?: string;
    beløp: number;
    måned: string;
    id: string;
    opptjeningsperiodeFom?: string;
    opptjeningsperiodeTom?: string;
    erMedIInntektsgrunnlag: boolean;
    erOpptjentIPeriode: boolean | undefined;
}

export interface Beregning {
    arbeidsgiveravgift: number;
    commitHash: string;
    feriepenger: number;
    id: string;
    lønn: number;
    refusjonsbeløp: number;
    beregnetBeløp: number;
    overTilskuddsbeløp: boolean;
    sumUtgifter: number;
    tjenestepensjon: number;
    tidligereUtbetalt: number;
    fratrekkLønnFerie: number;
    lønnFratrukketFerie: number;
    tidligereRefundertBeløp: number;
    sumUtgifterFratrukketRefundertBeløp: number;
}

export enum Korreksjonsgrunn {
    // REBEREGNING = 'REBEREGNING',
    UTBETALT_HELE_TILSKUDDSBELØP = 'UTBETALT_HELE_TILSKUDDSBELØP',
    INNTEKTER_RAPPORTERT_ETTER_TILSKUDDSPERIODE = 'INNTEKTER_RAPPORTERT_ETTER_TILSKUDDSPERIODE',
    HENT_INNTEKTER_PÅ_NYTT = 'HENT_INNTEKTER_PÅ_NYTT',
}
