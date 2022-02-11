import React, { FunctionComponent, useRef, useState } from 'react';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';
import './pagination.less';
import BEMHelper from '../../../utils/bem';
import { BedriftvalgType } from '../../../bruker/bedriftsmenyRefusjon/api/organisasjon';
import { ReactComponent as VenstreChevron } from '@/asset/image/dobbelChevronVenstre.svg';
import { ReactComponent as HoyreChevron } from '@/asset/image/dobbelChevronHoyre.svg';
import { Normaltekst } from 'nav-frontend-typografi';

const Pagination: FunctionComponent = () => {
    const cls = BEMHelper('pagination-bar');
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { pageData } = brukerContext;

    const setPageSizeOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        const newSize: number = parseInt(event.target.value);
        console.log('EVENT!');
        if (pageData.pagesize !== newSize) {
            brukerContext.setPageData(
                Object.assign({}, brukerContext.pageData, {
                    pagesize: newSize,
                })
            );
        }
    };

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
                <div className={cls.element('sidevisning-valg-container')}>
                    <Normaltekst>vis</Normaltekst>
                    <select
                        className={cls.element('select-page')}
                        value={pageData.pagesize}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setPageSizeOption(event)}
                    >
                        <option>5</option>
                        <option>7</option>
                        <option>10</option>
                    </select>
                    <div>
                        <Normaltekst>
                            {pageData.pagesize} av {pageData.totalItems}
                        </Normaltekst>
                    </div>
                </div>
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
