import React, { FunctionComponent, PropsWithChildren } from 'react';

// interface SortProperties {}

export const sorteringIndexRefusjonStatus = [
    'KLAR_FOR_INNSENDING',
    'FOR_TIDLIG',
    'SENDT_KRAV',
    'UTBETALT',
    'UTBETALING_FEILET',
    'UTGÅTT',
    'ANNULLERT',
    'KORRIGERT',
];

const SortContext = React.createContext<any>(null);

const SortProvider: FunctionComponent<{}> = (props: PropsWithChildren<{}>) => {
    return <SortContext.Provider value={null}>{props.children}</SortContext.Provider>;
};
export default SortProvider;
