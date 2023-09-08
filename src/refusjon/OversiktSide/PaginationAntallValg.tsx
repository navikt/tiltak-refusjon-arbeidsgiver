import React, { FunctionComponent } from 'react';
import { BodyShort } from '@navikt/ds-react';
import BEMHelper from '../../utils/bem';
import { BrukerContextType } from '../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../bruker/BrukerContext';
import { PageSizeOption } from '../../bruker/bedriftsmenyRefusjon/api/api';
import { useFilter } from '../oversikt/FilterContext';
import './paginationAntallValg.less';

const PagnationAntallValg: FunctionComponent = () => {
    const cls = BEMHelper('pagination-valg');
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { valgtBedrift } = brukerContext;
    const { filter, oppdaterFilter } = useFilter();
    return (
        <div className={cls.className}>
            <div className={cls.element('sidevisning-valg-container')}>
                <div className={cls.element('sidevisning-valg-wrapper')}>
                    <BodyShort size="small">vis</BodyShort>
                    <select
                        className={cls.element('select-page')}
                        value={filter.size}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                            event.preventDefault();
                            const newSize: number = parseInt(event.target.value);
                            oppdaterFilter({ size: newSize });
                        }}
                    >
                        <option>{PageSizeOption.FIVE}</option>
                        <option>{PageSizeOption.SEVEN}</option>
                        <option>{PageSizeOption.TEN}</option>
                        <option>{PageSizeOption.FIFTEEN}</option>
                    </select>
                    <div>
                        <BodyShort size="small">
                            {filter.size} av {valgtBedrift.pageData.totalItems}
                        </BodyShort>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PagnationAntallValg;
