import { render } from '@testing-library/react';
import moment from 'moment';
import * as React from 'react';
import { RefusjonStatus } from '../../refusjon/status';
import { datoString, formatterDato } from '../../utils/datoUtils';
import StatusTekst from './StatusTekst';
import { describe, test, expect } from 'vitest';

describe('Skal vise riktig statustekst', () => {
    test('UTGÅTT', () => {
        const tilskuddTom = datoString(moment().add(1, 'days'));
        const { getByText } = render(
            <StatusTekst
                status={RefusjonStatus.UTGÅTT}
                tilskuddFom={datoString(moment().subtract(2, 'days'))}
                tilskuddTom={tilskuddTom}
            />
        );
        expect(getByText('Frist utgått')).toBeDefined();
    });

    test('for tidlig', () => {
        const tilskuddTom = datoString(moment().add(1, 'days'));
        const { getByText } = render(
            <StatusTekst
                status={RefusjonStatus.FOR_TIDLIG}
                tilskuddFom={datoString(moment().subtract(2, 'days'))}
                tilskuddTom={tilskuddTom}
            />
        );
        expect(getByText('Søk fra ' + formatterDato(tilskuddTom))).toBeDefined();
    });

    test('Klar for innsending', () => {
        const { getByText } = render(
            <StatusTekst
                status={RefusjonStatus.KLAR_FOR_INNSENDING}
                tilskuddFom={datoString(moment())}
                tilskuddTom={datoString(moment())}
            />
        );
        expect(getByText(/Klar for innsending/i)).toBeDefined();
    });
});
