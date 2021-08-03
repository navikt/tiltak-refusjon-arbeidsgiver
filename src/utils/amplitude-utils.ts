import amplitude from './amplitudeInstance';
import { LogReturn } from 'amplitude-js';
import { Refusjon } from '../refusjon/refusjon';
import { Tiltak } from '../refusjon/tiltak';

type Tiltaktype = Tiltak | 'UNDEFINED';

export enum UtbetaltStatus {
    OK = 'OK',
    FEILET = 'FEILET',
}

interface InnSendtRefusjon {
    id: string;
    utbetaltStatus: UtbetaltStatus;
    error: Error | undefined;
    antallDagerTilTidsfrist: number;
    refusjonsbelop: number;
    beregnetbelop: number;
    tiltak: Tiltaktype;
}

interface ApnetRefusjon {
    id: string;
    refusjonsbelop: number;
    beregnetbelop: number;
    antallDagerTilTidsfrist: number;
    antallInntekterSomErMedIGrunnlag: number;
    ingenInntekter: boolean;
    ingenRefunderbareInntekter: boolean;
    harInntekterMenIkkeForHeleTilskuddsperioden: boolean;
}

const appkey = '#tiltak-refusjon-utside-';

export const regnUtDifferanseMellomDato = (fristForGodkjenning: string) => {
    const dagensdato = new Date().valueOf();
    const sluttdato = new Date(fristForGodkjenning).valueOf();
    const differanseTid = Math.abs(sluttdato - dagensdato);
    return Math.ceil(differanseTid / (1000 * 60 * 60 * 24));
};

export const registrerMenyValg = (key: string): LogReturn => amplitude.logEvent(appkey.concat(key));

export const brukerflate = (erDesktop: boolean): LogReturn =>
    amplitude.logEvent(appkey.concat(erDesktop ? 'desktop' : 'mobil'));

export const registrereBesok = (): LogReturn =>
    amplitude.logEvent(appkey.concat('besok'), {
        date: new Date().toISOString().split('T')[0],
        size: window.innerWidth,
        platform: window.innerWidth < 768 ? 'Desktop' : 'mobil',
    });

export const antallRefusjoner = (size: number): LogReturn =>
    amplitude.logEvent(appkey.concat('antall-refusjoner'), {
        antallRefusjoner: size,
        dato: new Date().toISOString().split('T')[0],
    });

export const innSendingRefusjon = (status: UtbetaltStatus, refusjon: Refusjon, err: Error | undefined): LogReturn => {
    const data: InnSendtRefusjon = {
        id: refusjon.id,
        utbetaltStatus: status,
        error: err,
        antallDagerTilTidsfrist: regnUtDifferanseMellomDato(refusjon.fristForGodkjenning),
        refusjonsbelop: refusjon.beregning?.refusjonsbeløp ?? 0,
        beregnetbelop: refusjon.beregning?.beregnetBeløp ?? 0,
        tiltak: refusjon?.tilskuddsgrunnlag?.tiltakstype ?? 'UNDEFINED',
    };
    return amplitude.logEvent(appkey.concat('innsendt-refusjon'), { ...data });
};

export const refusjonApnet = (
    refusjon: Refusjon,
    antallInntekterSomErMedIGrunnlag: number,
    ingenInntekter: boolean,
    ingenRefunderbareInntekter: boolean,
    harInntekterMenIkkeForHeleTilskuddsperioden: boolean
): LogReturn => {
    const data: ApnetRefusjon = {
        id: refusjon.id,
        refusjonsbelop: refusjon.beregning?.refusjonsbeløp ?? 0,
        beregnetbelop: refusjon.beregning?.beregnetBeløp ?? 0,
        antallDagerTilTidsfrist: regnUtDifferanseMellomDato(refusjon.fristForGodkjenning),
        antallInntekterSomErMedIGrunnlag: antallInntekterSomErMedIGrunnlag,
        ingenInntekter: ingenInntekter,
        ingenRefunderbareInntekter: ingenRefunderbareInntekter,
        harInntekterMenIkkeForHeleTilskuddsperioden: harInntekterMenIkkeForHeleTilskuddsperioden,
    };
    return amplitude.logEvent(appkey.concat('apnet-refusjon'), { ...data });
};

export const eksternlenkerTrykket = (url: string) => {
    return amplitude.logEvent(appkey.concat('eksternlenke-trykket'), { lenke: url });
};
