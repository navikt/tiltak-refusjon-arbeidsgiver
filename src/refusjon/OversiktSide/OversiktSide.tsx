import React, { FunctionComponent, Suspense } from 'react';
import OversiktSkeleton from '../../komponenter/OversiktSkeleton/OversiktSkeleton';
import BEMHelper from '../../utils/bem';
import Filtermeny from '../oversikt/Filtermeny';
import Oversikt from '../oversikt/Oversikt';
import './OversiktSide.less';
const cls = BEMHelper('OversiktSide');

const OversiktSide: FunctionComponent = () => {
    return (
        <div className={cls.className}>
            <div className={cls.element('wrapper')}>
                <div className={cls.element('meny')}>
                    <Filtermeny />
                </div>
                <div className={cls.element('container')}>
                    <Suspense fallback={<OversiktSkeleton />}>
                        <Oversikt />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default OversiktSide;
