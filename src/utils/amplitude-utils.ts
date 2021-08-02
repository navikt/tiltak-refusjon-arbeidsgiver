import amplitude from './amplitudeInstance';
import { LogReturn } from 'amplitude-js';

const appkey = '#tiltak-refusjon-utside-';

export const registrerMenyValg = (key: string): LogReturn => amplitude.logEvent(appkey.concat(key));

export const brukerflate = (erDesktop: boolean): LogReturn =>
    amplitude.logEvent(appkey.concat(erDesktop ? 'desktop' : 'mobil'));

export const registrereBesok = (): LogReturn => amplitude.logEvent(appkey.concat('besok'));

export const skjermstorrelse = (size: number): LogReturn =>
    amplitude.logEvent(appkey.concat('skjermStorrelse-'.concat(size.toString(10))));

export const antallRefusjoner = (size: number): LogReturn =>
    amplitude.logEvent(appkey.concat('antall-refusjoner-'.concat(size.toString(10))), { dato: new Date() });

export const feilVedInnSending = (err: string): LogReturn => amplitude.logEvent(appkey.concat(err));
