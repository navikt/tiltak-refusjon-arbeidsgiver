import amplitude from './amplitudeInstance';
import { LogReturn } from 'amplitude-js';

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

export const feilVedInnSending = (err: string): LogReturn => amplitude.logEvent(appkey.concat(err));
