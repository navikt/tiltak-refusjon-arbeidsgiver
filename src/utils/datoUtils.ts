import moment, { DurationInputArg2, Moment } from 'moment';
import 'moment/locale/nb';
import { storForbokstav } from './stringUtils';

moment.locale('nb');

export const NORSK_MÅNEDÅR_FORMAT = 'YYYY/MM';
export const NORSK_DATO_FORMAT = 'DD.MM.YYYY';
export const NORSK_DATO_OG_TID_FORMAT = 'DD.MM.YYYY HH:mm';

export const formatterDato = (dato: string, format: string = NORSK_DATO_FORMAT) => {
    try {
        const formattertDato = moment(dato).format(format);
        return !formattertDato.includes('NaN') ? formattertDato : dato;
    } catch (e) {
        // Kunne ikke caste stringen til dato.
        return dato;
    }
};

export const formatterPeriode = (fra: string, til: string, format: string = NORSK_DATO_FORMAT) => {
    return formatterDato(fra, format) + ' – ' + formatterDato(til, format);
};

export const getMåned = (dato: string) => {
    try {
        const formattertDato = moment(dato).format('MMMM');
        return !formattertDato.includes('NaN') ? storForbokstav(formattertDato) : dato;
    } catch (e) {
        // Kunne ikke caste stringen til dato.
        return dato;
    }
};

export const getEnheterMellom = (
    datoFom: string,
    datoTom: string,
    enhet: DurationInputArg2,
    compareFormat: string,
    returnFormat: string
): string[] => {
    const dateStart = moment(datoFom);
    const dateEnd = moment(datoTom);
    let timeValues = [];

    while (dateStart.format(compareFormat) !== dateEnd.format(compareFormat)) {
        timeValues.push(dateStart.format(returnFormat));
        dateStart.add(1, enhet);
    }
    timeValues.push(dateStart.format(returnFormat));
    dateStart.add(1, enhet);
    return timeValues;
};

export const sjekkOmSluttDatoErSatt = (dato: Moment, startDatoMnd: Moment): Moment => {
    return dato.format('YYYY-MM-DD') !== 'Invalid date' ? dato : moment(startDatoMnd).endOf('month');
};

export const getEnheterMellomStandardFormat = (datoFom: string, datoTom: string): string[] => {
    return getEnheterMellom(datoFom, datoTom, 'day', 'YYYY-MM-DD', 'YYYY-MM-DD');
};

export const getAntallMndTilSVGGrid = (fraDato: string, tilDato: string): string[] => {
    const antallMnd = getEnheterMellom(fraDato, tilDato, 'month', 'M', 'MMMM');
    antallMnd.push(
        moment(antallMnd[antallMnd.length - 1], 'MMMM')
            .add(1, 'month')
            .format('MMMM')
    );

    return antallMnd;
};

export const datoString = (dato: Moment): string => dato.format('YYYY-MM-DD');
