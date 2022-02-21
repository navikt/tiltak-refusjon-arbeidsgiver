import React, { FunctionComponent } from 'react';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';
import './pagination.less';
import BEMHelper from '../../../utils/bem';
import { BedriftvalgType, PageSizeOption } from '../../../bruker/bedriftsmenyRefusjon/api/organisasjon';
import { Normaltekst } from 'nav-frontend-typografi';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import PaginationBar from './PaginationBar';

const Pagination: FunctionComponent = () => {
    const cls = BEMHelper('pagination-bar');
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { valgtBedrift, setValgtBedrift } = brukerContext;

    const setNewPage = (newPageNr: number, newPageSize: number) => {
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

    const setPageSizeOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        const newSize: number = parseInt(event.target.value);
        if (valgtBedrift?.pageData?.pagesize !== newSize) {
            setNewPage(0, newSize);
        }
    };

    return valgtBedrift &&
        valgtBedrift?.pageData?.totalPages > 1 &&
        brukerContext.valgtBedrift.type !== BedriftvalgType.ENKELBEDRIFT ? (
        <div className={cls.className}>
            <div className={cls.element('wrapper')}>
                <div className={cls.element('sidevisning-valg-container')}>
                    <div className={cls.element('sidevisning-valg-wrapper')}>
                        <Normaltekst>vis</Normaltekst>
                        <select
                            className={cls.element('select-page')}
                            value={valgtBedrift.pageData.pagesize}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setPageSizeOption(event)}
                        >
                            <option>{PageSizeOption.FIVE}</option>
                            <option>{PageSizeOption.SEVEN}</option>
                            <option>{PageSizeOption.TEN}</option>
                        </select>
                        <div>
                            <Normaltekst>
                                {valgtBedrift.pageData.pagesize} av {valgtBedrift.pageData.totalItems}
                            </Normaltekst>
                        </div>
                    </div>
                </div>
                <div className={cls.element('container')}>
                    <ul className={cls.element('pagination-list')}>
                        <li
                            className={cls.element('chevron-venstre')}
                            onClick={() => {
                                if (valgtBedrift.pageData.currentPage !== 0) {
                                    setNewPage(valgtBedrift.pageData.currentPage - 1, valgtBedrift.pageData.pagesize);
                                }
                            }}
                        >
                            <VenstreChevron />
                        </li>
                        <PaginationBar />
                        <li
                            className={cls.element('chevron-hoyre')}
                            onClick={() => {
                                if (valgtBedrift.pageData.totalPages !== valgtBedrift.pageData.currentPage + 1) {
                                    setNewPage(valgtBedrift.pageData.currentPage + 1, valgtBedrift.pageData.pagesize);
                                }
                            }}
                        >
                            <HoyreChevron />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    ) : null;
};
export default Pagination;
