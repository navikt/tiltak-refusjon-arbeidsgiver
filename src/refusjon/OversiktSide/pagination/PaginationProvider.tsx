import React, { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';
import { useFilter } from '../../oversikt/FilterContext';

interface Context {
    setPageSizeOption: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    setNewPage: (newPageNr: number, newPageSize: number) => void;
}

export const PaginationContext = React.createContext<Context>({} as Context);

const PaginationProvider: FunctionComponent<{}> = (props: PropsWithChildren<{}>) => {
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { filter, oppdaterFilter } = useFilter();
    const { valgtBedrift, setValgtBedrift } = brukerContext;

    useEffect(() => {
        const { currentPage, size, totalItems, totalPages } = valgtBedrift.pageData;
        setValgtBedrift(
            Object.assign({}, valgtBedrift, {
                pageData: {
                    page: filter.page || 0,
                    pagesize: filter.size || 10,
                    currentPage: currentPage,
                    size: size,
                    totalItems: totalItems,
                    totalPages: totalPages,
                },
            })
        );
        // eslint-disable-next-line
    }, [filter]);

    const setNewPage = (newPageNr: number, newPageSize: number): void => {
        oppdaterFilter({ ...filter, page: newPageNr, size: newPageSize });
    };

    const setPageSizeOption = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        event.preventDefault();
        const newSize: number = parseInt(event.target.value);
        if (valgtBedrift?.pageData?.pagesize !== newSize) {
            setNewPage(0, newSize);
        }
    };

    const context: Context = {
        setPageSizeOption,
        setNewPage,
    };

    return <PaginationContext.Provider value={context}>{props.children}</PaginationContext.Provider>;
};
export default PaginationProvider;
