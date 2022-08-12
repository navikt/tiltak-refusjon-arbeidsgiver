import React, { FunctionComponent, PropsWithChildren } from 'react';
import { SortingOrder } from '../refusjon';
import { ReactComponent as TriangleUp } from '@/asset/image/triangleUp.svg';
import { ReactComponent as TriangleDown } from '@/asset/image/triangleDown.svg';
import BEMHelper from '../../utils/bem';
import { useFilter } from './FilterContext';

interface SortingProps {
    className: string;
    sortingAsc: SortingOrder;
    sortingDesc: SortingOrder;
    highlightSortOrderAsc: boolean;
    highlightSortOrderDesc: boolean;
}

const SortingValg: FunctionComponent<SortingProps> = (props: PropsWithChildren<SortingProps>) => {
    const cls = BEMHelper(props.className);
    const { filter, oppdaterFilter } = useFilter();
    const { sortingDesc, sortingAsc, highlightSortOrderAsc, highlightSortOrderDesc } = props;

    return (
        <span className={cls.element('label-sortering')}>
            <TriangleUp
                className={cls.element('sortering', highlightSortOrderAsc ? 'asc-selected' : 'asc')}
                onClick={() => oppdaterFilter({ ...filter, sorting: sortingAsc })}
            />
            <TriangleDown
                className={cls.element('sortering', highlightSortOrderDesc ? 'desc-selected' : 'desc')}
                onClick={() => oppdaterFilter({ ...filter, sorting: sortingDesc })}
            />
        </span>
    );
};
export default SortingValg;
