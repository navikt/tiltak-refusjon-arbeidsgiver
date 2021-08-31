import React from 'react';
import { Status } from './status';
import { Tiltak } from './tiltak';

export interface Refusjon {
    id: string;
    bedriftNr: string;
    bedriftKontonummer?: string;
    deltakerFnr: string;
    godkjentAvArbeidsgiver?: string;
    godkjentAvSaksbehandler?: string;
    status: Status;
    tilskuddsgrunnlag: Tilskuddsgrunnlag;
    inntektsgrunnlag?: Inntektsgrunnlag;
    beregning?: Beregning;
    fristForGodkjenning: string;
    harInntektIAlleMåneder: boolean;
}

export interface Tilskuddsgrunnlag {
    arbeidsgiveravgiftSats: number;
    avtaleId: string;
    bedriftNavn: string;
    bedriftNr: string;
    deltakerEtternavn: string;
    deltakerFnr: string;
    deltakerFornavn: string;
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
    avtaleNr: number;
    løpenummer: number;
}

export interface Inntektsgrunnlag {
    innhentetTidspunkt: string;
    inntekter: Inntektslinje[];
}

export interface Inntektslinje {
    inntektType: string;
    beskrivelse?: string;
    beløp: number;
    måned: string;
    id: string;
    opptjeningsperiodeFom?: string;
    opptjeningsperiodeTom?: string;
    inntektFordelesFom: string;
    inntektFordelesTom: string;
    erMedIInntektsgrunnlag: boolean;
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
}
