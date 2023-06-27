import React, { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';
import { useFilter } from '../../oversikt/FilterContext';

interface Context {
    setPageSizeOption: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    setNewPage: (newPageNr: number, newPageSize: number) => void;
}

export const PaginationContext = React.createContext<Context>({} as Context);

const PaginationProvider: FunctionComponent<PropsWithChildren> = (props: PropsWithChildren) => {
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { filter } = useFilter();
    const { valgtBedrift, setValgtBedrift } = brukerContext;

    useEffect(() => {
        if (valgtBedrift?.pageData?.currentPage !== 0) {
            setValgtBedrift(
                Object.assign({}, valgtBedrift, {
                    pageData: {
                        ...valgtBedrift.pageData,
                        currentPage: 0,
                        page: 0,
                    },
                })
            );
        }
        // eslint-disable-next-line
    }, [filter]);

    const setNewPage = (newPageNr: number, newPageSize: number): void => {
        const { currentPage, size, totalItems, totalPages } = valgtBedrift.pageData;
        setValgtBedrift(
            Object.assign({}, valgtBedrift, {
                pageData: {
                    page: newPageNr,
                    pagesize: newPageSize,
                    currentPage: currentPage,
                    size: size,
                    totalItems: totalItems,
                    totalPages: totalPages,
                },
            })
        );
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
