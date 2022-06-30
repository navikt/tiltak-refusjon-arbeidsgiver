import React, { FunctionComponent, useContext } from 'react';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';
import './pagination.less';
import BEMHelper from '../../../utils/bem';
import { BedriftvalgType } from '../../../bruker/bedriftsmenyRefusjon/api/organisasjon';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import PaginationBar from './PaginationBar';
import { PaginationContext } from './PaginationProvider';

const Pagination: FunctionComponent = () => {
    const cls = BEMHelper('pagination-bar');
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { valgtBedrift } = brukerContext;
    const { setNewPage } = useContext(PaginationContext);

    return valgtBedrift &&
        valgtBedrift?.pageData?.totalPages > 1 &&
        brukerContext.valgtBedrift.type !== BedriftvalgType.ENKELBEDRIFT ? (
        <div className={cls.className}>
            <div className={cls.element('wrapper')}>
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
