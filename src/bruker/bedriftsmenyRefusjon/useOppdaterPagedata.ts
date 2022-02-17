import { Dispatch, SetStateAction, useEffect } from 'react';
import { PageableRefusjon } from '../../refusjon/refusjon';
import { Bedriftvalg } from './api/organisasjon';

function useOppdaterPagedata(
    pagable: PageableRefusjon,
    valgtBedrift: Bedriftvalg,
    setValgtBedrift: Dispatch<SetStateAction<Bedriftvalg | undefined>>
) {
    const { currentPage, size, totalItems, totalPages } = pagable;
    useEffect(() => {
        if (
            currentPage !== valgtBedrift.pageData.currentPage ||
            size !== valgtBedrift.pageData.size ||
            totalItems !== valgtBedrift.pageData.totalItems ||
            totalPages !== valgtBedrift.pageData.totalPages
        ) {
            setValgtBedrift(
                Object.assign({}, valgtBedrift, {
                    pageData: {
                        page: valgtBedrift.pageData.page,
                        pagesize: valgtBedrift.pageData.pagesize,
                        currentPage: currentPage,
                        size: size,
                        totalItems: totalItems,
                        totalPages: totalPages,
                    },
                })
            );
        }
    }, [currentPage, size, totalItems, totalPages, valgtBedrift, setValgtBedrift, pagable]);
}
export default useOppdaterPagedata;
