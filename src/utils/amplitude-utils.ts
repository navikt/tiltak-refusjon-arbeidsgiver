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
    belop: number;
    tiltak: Tiltaktype;
}

const appkey = '#tiltak-refusjon-utside-';

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
    const dagensdato = new Date().valueOf();
    const sluttdato = new Date(refusjon.fristForGodkjenning).valueOf();
    const differanseTid = Math.abs(sluttdato - dagensdato);
    const antalldagerTilfristen = Math.ceil(differanseTid / (1000 * 60 * 60 * 24));

    const data: InnSendtRefusjon = {
        id: refusjon.id,
        utbetaltStatus: status,
        error: err,
        antallDagerTilTidsfrist: antalldagerTilfristen,
        belop: refusjon.beregning?.refusjonsbeløp ?? 0,
        tiltak: refusjon?.tilskuddsgrunnlag?.tiltakstype ?? 'UNDEFINED',
    };
    return amplitude.logEvent(appkey.concat('innsendt-refusjon'), { ...data });
};

export const feilVedInnSending = (err: string): LogReturn => amplitude.logEvent(appkey.concat(err));
