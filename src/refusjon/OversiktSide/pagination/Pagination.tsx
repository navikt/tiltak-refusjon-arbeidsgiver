import React, { FunctionComponent } from 'react';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';
import './pagination.less';
import BEMHelper from '../../../utils/bem';
import { BedriftvalgType } from '../../../bruker/bedriftsmenyRefusjon/api/organisasjon';
import KnappBase from 'nav-frontend-knapper';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';

const Pagination: FunctionComponent = () => {
    const cls = BEMHelper('pagination-bar');
    const brukerContext: BrukerContextType = useInnloggetBruker();

    console.log('brukerContext.pageData.totalPages', brukerContext.pageData);
    function generatePagination() {
        const steps = [];
        for (let i = 0; i < brukerContext.pageData.totalPages; i++) {
            steps.push(
                <div>
                    <button
                        className={cls.element(
                            'steg-knapp',
                            brukerContext.pageData.currentPage === i ? 'aktivsteg' : ''
                        )}
                    >
                        {i + 1}
                    </button>
                </div>
            );
        }
        return steps;
    }

    return brukerContext.pageData.totalPages > 1 && brukerContext.valgtBedrift.type !== BedriftvalgType.ENKELBEDRIFT ? (
        <div className={cls.className}>
            <div className={cls.element('wrapper')}>
                <div className={cls.element('container')}>
                    <VenstreChevron />
                    {generatePagination().map((s, i) => {
                        return <div key={i}>{s}</div>;
                    })}
                    <HoyreChevron />
                </div>
            </div>
        </div>
    ) : null;
};
export default Pagination;
