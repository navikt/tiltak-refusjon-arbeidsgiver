import { useEffect } from 'react';
import { PageableRefusjon } from '../../refusjon/refusjon';
import { PageData, SettPageData } from '../BrukerContextType';

function useOppdaterPagedata(pagable: PageableRefusjon, pageData: PageData, setPageData: SettPageData) {
    const { currentPage, size, totalItems, totalPages } = pagable;
    useEffect(() => {
        if (
            currentPage !== pageData.currentPage ||
            size !== pageData.size ||
            totalItems !== pageData.totalItems ||
            totalPages !== pageData.totalPages
        ) {
            setPageData(
                Object.assign({}, pageData, {
                    currentPage: currentPage,
                    size: size,
                    totalItems: totalItems,
                    totalPages: totalPages,
                })
            );
        }
    }, [currentPage, size, totalItems, totalPages, pageData, setPageData, pagable]);
}
export default useOppdaterPagedata;
