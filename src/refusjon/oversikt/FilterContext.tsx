import React, { FunctionComponent, useContext, useState } from 'react';
import { Status } from '../status';
import { Tiltak } from '../tiltak';
import { registrerMenyValg } from '../../utils/amplitude-utils';

export interface Filter {
    status: Status | undefined;
    tiltakstype: Tiltak | undefined;
}

type FilterContextType = { filter: Filter; oppdaterFilter: (nyttFilter: Partial<Filter>) => void };

const FilterContext = React.createContext<FilterContextType | undefined>(undefined);

// Egen hook fordi det sjekkes at den blir brukt riktig, og kan ha undefined som defaultValue
export const useFilter = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('Kan kun brukes innenfor FilterProvider');
    }
    return context;
};

export const FilterProvider: FunctionComponent = (props) => {
    const [filter, setFilter] = useState<Filter>({
        status: undefined,
        tiltakstype: undefined,
    });

    const oppdaterFilter = (nyttFilter: Partial<Filter>) => {
        setFilter({ ...filter, ...nyttFilter });
        if (nyttFilter.status) {
            registrerMenyValg(nyttFilter.status);
        } else registrerMenyValg('undefined');
    };

    return (
        <FilterContext.Provider
            value={{
                filter,
                oppdaterFilter,
            }}
        >
            {props.children}
        </FilterContext.Provider>
    );
};
