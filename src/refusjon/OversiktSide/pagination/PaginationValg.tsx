import React, { FunctionComponent, useContext } from 'react';
import { BodyShort } from '@navikt/ds-react';
import { PageSizeOption } from '../../../bruker/bedriftsmenyRefusjon/api/api';
import BEMHelper from '../../../utils/bem';
import { PaginationContext } from './PaginationProvider';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';
import './paginationValg.less';

const PagnationValg: FunctionComponent = () => {
    const cls = BEMHelper('pagination-valg');
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { valgtBedrift } = brukerContext;
    const { setPageSizeOption } = useContext(PaginationContext);
    return (
        <div className={cls.className}>
            <div className={cls.element('sidevisning-valg-container')}>
                <div className={cls.element('sidevisning-valg-wrapper')}>
                    <BodyShort size="small">vis</BodyShort>
                    <select
                        className={cls.element('select-page')}
                        value={valgtBedrift.pageData.pagesize}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setPageSizeOption(event)}
                    >
                        <option>{PageSizeOption.FIVE}</option>
                        <option>{PageSizeOption.SEVEN}</option>
                        <option>{PageSizeOption.TEN}</option>
                        <option>{PageSizeOption.FIFTEEN}</option>
                    </select>
                    <div>
                        <BodyShort size="small">
                            {valgtBedrift.pageData.pagesize} av {valgtBedrift.pageData.totalItems}
                        </BodyShort>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PagnationValg;
