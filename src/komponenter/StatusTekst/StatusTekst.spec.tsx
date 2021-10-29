import { render } from '@testing-library/react';
import moment from 'moment';
import * as React from 'react';
import { Status } from '../../refusjon/status';
import { datoString, formatterDato } from '../../utils/datoUtils';
import StatusTekst from './StatusTekst';

describe('Skal vise riktig statustekst', () => {
    test('UTGÅTT', () => {
        const tilskuddTom = datoString(moment().add(1, 'days'));
        const { getByText } = render(
            <StatusTekst
                status={Status.UTGÅTT}
                tilskuddFom={datoString(moment().subtract(2, 'days'))}
                tilskuddTom={tilskuddTom}
            />
        );
        expect(getByText('Frist utgått')).toBeInTheDocument();
    });

    test('for tidlig', () => {
        const tilskuddTom = datoString(moment().add(1, 'days'));
        const { getByText } = render(
            <StatusTekst
                status={Status.FOR_TIDLIG}
                tilskuddFom={datoString(moment().subtract(2, 'days'))}
                tilskuddTom={tilskuddTom}
            />
        );
        expect(getByText('Søk fra ' + formatterDato(tilskuddTom))).toBeInTheDocument();
    });

    test('Klar for innsending', () => {
        const { getByText } = render(
            <StatusTekst
                status={Status.KLAR_FOR_INNSENDING}
                tilskuddFom={datoString(moment())}
                tilskuddTom={datoString(moment())}
            />
        );
        expect(getByText(/Klar for innsending/i)).toBeInTheDocument();
    });

    test('Utbetaling feilet', () => {
        const { getByText } = render(
            <StatusTekst
                status={Status.UTBETALING_FEILET}
                tilskuddFom={datoString(moment())}
                tilskuddTom={datoString(moment())}
            />
        );
        expect(getByText(/Utbetaling feilet/i)).toBeInTheDocument();
    });

    test('Utbetaling velykket', () => {
        const { getByText } = render(
            <StatusTekst
                status={Status.UTBETALT}
                tilskuddFom={datoString(moment())}
                tilskuddTom={datoString(moment())}
            />
        );
        expect(getByText(/Utbetalt/i)).toBeInTheDocument();
    });
});
