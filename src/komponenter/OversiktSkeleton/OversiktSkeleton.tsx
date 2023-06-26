import React from 'react';
import Skeleton from 'react-loading-skeleton';
import LabelRad from '../../refusjon/oversikt/LabelRad';
import BEMHelper from '../../utils/bem';

const cls = BEMHelper('oversikt');

export default function OversiktSkeleton() {
    return (
        <div className={cls.className}>
            <LabelRad />
            <Skeleton count={3} className={cls.element('rad')} />
        </div>
    );
}
