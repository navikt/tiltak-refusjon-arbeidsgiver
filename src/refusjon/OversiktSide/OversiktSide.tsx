import React, { FunctionComponent, Suspense } from 'react';
import OversiktSkeleton from '../../komponenter/OversiktSkeleton/OversiktSkeleton';
import BEMHelper from '../../utils/bem';
import { FilterProvider } from '../oversikt/FilterContext';
import Filtermeny from '../oversikt/Filtermeny';
import Oversikt from '../oversikt/Oversikt';
import './OversiktSide.less';
import Pagination from './pagination/Pagination';
const cls = BEMHelper('OversiktSide');

const OversiktSide: FunctionComponent = () => {
    return (
        <FilterProvider>
            <div className={cls.className}>
                <div className={cls.element('wrapper')}>
                    <div className={cls.element('meny')}>
                        <Filtermeny />
                    </div>
                    <div className={cls.element('container')}>
                        <Suspense fallback={<OversiktSkeleton />}>
                            <Oversikt />
                        </Suspense>
                        <Pagination />
                    </div>
                </div>
            </div>
        </FilterProvider>
    );
};

export default OversiktSide;
