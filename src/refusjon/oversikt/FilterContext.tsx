import React, { FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { registrerMenyValg } from '../../utils/amplitude-utils';
import { useSearchParams } from 'react-router-dom';
import { RefusjonStatus } from '../status';
import { Tiltak } from '../tiltak';
import { LogReturn } from 'amplitude-js';
import { SortingOrder } from '../refusjon';

export interface Filter {
    status: RefusjonStatus | undefined;
    tiltakstype: Tiltak | undefined;
    sorting: SortingOrder | undefined;
    page: number | undefined;
    size: number | undefined;
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

const searchParamsToFilter = (searchParams: URLSearchParams): Filter => {
    return {
        status: (searchParams.get('status') || undefined) as RefusjonStatus | undefined,
        tiltakstype: (searchParams.get('tiltakstype') || undefined) as Tiltak | undefined,
        sorting: (searchParams.get('sorting') || undefined) as SortingOrder | undefined,
        page: searchParams.has('page') ? parseInt(searchParams.get('page') || '') : undefined,
        size: searchParams.has('size') ? parseInt(searchParams.get('size') || '') : undefined,
    };
};

// Alle oppdateringer av søkefilter går først veien via adresselinjen, før filteret til slutt oppdateres.
// Slik sikrer vi at adresselinjen er sannhetskilden for filtre og paginering, og sparer oss forhåpentligvis for synkroniseringsproblemer.
export const FilterProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState<Filter>(searchParamsToFilter(searchParams));

    useEffect(() => {
        setFilter(searchParamsToFilter(searchParams));
    }, [searchParams]);

    // Lite elegant og høyst manuell måte å oppdatere adresselinjen på når vi setter nye filterverdier
    const oppdaterSearchParams = (searchParams: URLSearchParams, nyttFilter: Partial<Filter>) => {
        const newSearchParams = new URLSearchParams(searchParams);
        // Hvis vi bytter status eller tiltakstype, gå til page 1
        if (nyttFilter.status || nyttFilter.tiltakstype) {
            newSearchParams.delete('page');
        }
        // Hvis vi "nuller ut" status, slett parameteren fra URL
        if (nyttFilter.hasOwnProperty('status') && nyttFilter.status === undefined) newSearchParams.delete('status');
        if (nyttFilter.status) newSearchParams.set('status', nyttFilter.status);
        // Hvis vi "nuller ut" tiltakstype, slett parameteren fra URL
        if (nyttFilter.hasOwnProperty('tiltakstype') && nyttFilter.tiltakstype === undefined)
            newSearchParams.delete('tiltakstype');
        if (nyttFilter.tiltakstype) newSearchParams.set('tiltakstype', nyttFilter.tiltakstype);
        if (nyttFilter.sorting) newSearchParams.set('sorting', nyttFilter.sorting);
        // Sneaky javascript-logikk: side 0 vil tolkes som false, så vi må sjekke det også
        if (nyttFilter.hasOwnProperty('page') && (nyttFilter.page === undefined || nyttFilter.page === 0))
            newSearchParams.delete('page');
        if (nyttFilter.page) newSearchParams.set('page', `${nyttFilter.page}`);
        if (nyttFilter.size) newSearchParams.set('size', `${nyttFilter.size}`);

        setSearchParams(newSearchParams);
    };

    const oppdaterFilter = (nyttFilter: Partial<Filter>): LogReturn => {
        oppdaterSearchParams(searchParams, nyttFilter);
        if (nyttFilter.status) return registrerMenyValg(nyttFilter.status);
        return registrerMenyValg('Alle');
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
