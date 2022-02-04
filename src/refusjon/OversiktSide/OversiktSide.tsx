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
        <div className={cls.className}>
            <div className={cls.element('wrapper')}>
                <FilterProvider>
                    <div className={cls.element('meny')}>
                        <Filtermeny />
                    </div>
                    <div className={cls.element('container')}>
                        <Suspense fallback={<OversiktSkeleton />}>
                            <Oversikt />
                        </Suspense>
                        <Pagination />
                    </div>
                </FilterProvider>
            </div>
        </div>
    );
};

export default OversiktSide;
