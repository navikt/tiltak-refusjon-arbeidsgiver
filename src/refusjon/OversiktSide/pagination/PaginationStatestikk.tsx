import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import BEMHelper from '../../../utils/bem';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';

const PaginationStatestikk: FunctionComponent = () => {
    const cls = BEMHelper('pagination-bar');
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { valgtBedrift } = brukerContext;

    return (
        <div>
            <div className={cls.element('visning-statestikk')}>
                <>
                    <Normaltekst>
                        antall refusjoner:
                        <span className={cls.element('visning-statestikk-data')}>
                            {valgtBedrift?.pageData.totalItems}
                        </span>
                    </Normaltekst>
                    <Normaltekst>
                        nåværende sidevisning:
                        <span className={cls.element('visning-statestikk-data')}>
                            {valgtBedrift?.pageData.currentPage + 1}
                        </span>
                    </Normaltekst>
                    <Normaltekst>
                        antall sider:
                        <span className={cls.element('visning-statestikk-data')}>
                            {valgtBedrift?.pageData.totalPages}
                        </span>
                    </Normaltekst>
                </>
            </div>
        </div>
    );
};
export default PaginationStatestikk;
