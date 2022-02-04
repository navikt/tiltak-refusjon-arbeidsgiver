import React, { FunctionComponent } from 'react';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';
import './pagination.less';
import BEMHelper from '../../../utils/bem';
import { BedriftvalgType } from '../../../bruker/bedriftsmenyRefusjon/api/organisasjon';
import { ReactComponent as VenstreChevron } from '@/asset/image/dobbelChevronVenstre.svg';
import { ReactComponent as HoyreChevron } from '@/asset/image/dobbelChevronHoyre.svg';

const Pagination: FunctionComponent = () => {
    const cls = BEMHelper('pagination-bar');
    const brukerContext: BrukerContextType = useInnloggetBruker();

    function generatePagination() {
        const steg = [];
        for (let i = 0; i < brukerContext.pageData.totalPages; i++) {
            steg.push(
                <div>
                    <button
                        className={cls.element(
                            'steg-knapp',
                            brukerContext.pageData.currentPage === i ? 'aktivsteg' : ''
                        )}
                        onClick={() => {
                            brukerContext.setPageData(
                                Object.assign({}, brukerContext.pageData, {
                                    page: i,
                                })
                            );
                        }}
                    >
                        {i + 1}
                    </button>
                </div>
            );
        }
        return steg;
    }

    return brukerContext.pageData.totalPages > 1 && brukerContext.valgtBedrift.type !== BedriftvalgType.ENKELBEDRIFT ? (
        <div className={cls.className}>
            <div className={cls.element('wrapper')}>
                <div className={cls.element('container')}>
                    <button
                        className={cls.element('chevron-venstre')}
                        onClick={() => {
                            if (brukerContext.pageData.currentPage !== 0) {
                                brukerContext.setPageData(
                                    Object.assign({}, brukerContext.pageData, {
                                        page: brukerContext.pageData.currentPage - 1,
                                    })
                                );
                            }
                        }}
                    >
                        <VenstreChevron />
                    </button>
                    {generatePagination().map((steg, index) => {
                        return <div key={index}>{steg}</div>;
                    })}
                    <button
                        className={cls.element('chevron-hoyre')}
                        onClick={() => {
                            if (brukerContext.pageData.totalPages !== brukerContext.pageData.currentPage + 1) {
                                brukerContext.setPageData(
                                    Object.assign({}, brukerContext.pageData, {
                                        page: brukerContext.pageData.currentPage + 1,
                                    })
                                );
                            }
                        }}
                    >
                        <HoyreChevron />
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};
export default Pagination;
