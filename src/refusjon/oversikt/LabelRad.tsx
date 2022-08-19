import React from 'react';
import BEMHelper from '../../utils/bem';
import { Element } from 'nav-frontend-typografi';
import { useFilter } from './FilterContext';
import { SortingOrder } from '../refusjon';
import SortingValg from './SortingValg';

interface Props {
    className: string;
}

const LabelRad = (props: Props) => {
    const cls = BEMHelper(props.className);
    const { filter } = useFilter();

    return (
        <div className={cls.element('label-rad')} aria-label="rad overkrifter for kolonnene i refusonslisten">
            <div className={cls.element('kolonne')} id={cls.element('deltaker')}>
                <Element className={cls.element('label')}>Deltaker</Element>
                <SortingValg
                    className={cls.className}
                    sortingAsc={SortingOrder.DELTAKER_ASC}
                    sortingDesc={SortingOrder.DELTAKER_DESC}
                    highlightSortOrderAsc={filter.sorting === SortingOrder.DELTAKER_ASC}
                    highlightSortOrderDesc={filter.sorting === SortingOrder.DELTAKER_DESC}
                />
            </div>
            <div className={cls.element('kolonne')} id={cls.element('periode')}>
                <Element className={cls.element('label')}>Periode</Element>
                <SortingValg
                    className={cls.className}
                    sortingAsc={SortingOrder.PERIODE_ASC}
                    sortingDesc={SortingOrder.PERIODE_DESC}
                    highlightSortOrderAsc={filter.sorting === SortingOrder.PERIODE_ASC}
                    highlightSortOrderDesc={filter.sorting === SortingOrder.PERIODE_DESC}
                />
            </div>
            <div className={cls.element('kolonne')} id={cls.element('status')}>
                <Element className={cls.element('label')}>Status</Element>
                <SortingValg
                    className={cls.className}
                    sortingAsc={SortingOrder.STATUS_ASC}
                    sortingDesc={SortingOrder.STATUS_DESC}
                    highlightSortOrderAsc={filter.sorting === SortingOrder.STATUS_ASC || filter.sorting === undefined}
                    highlightSortOrderDesc={filter.sorting === SortingOrder.STATUS_DESC}
                />
            </div>
            <div className={cls.element('kolonne')} id={cls.element('frist-godkjenning')}>
                <Element className={cls.element('label')}>Frist for godkjenning</Element>
                <SortingValg
                    className={cls.className}
                    sortingAsc={SortingOrder.FRISTFORGODKJENNING_ASC}
                    sortingDesc={SortingOrder.FRISTFORGODKJENNING_DESC}
                    highlightSortOrderAsc={filter.sorting === SortingOrder.FRISTFORGODKJENNING_ASC}
                    highlightSortOrderDesc={filter.sorting === SortingOrder.FRISTFORGODKJENNING_DESC}
                />
            </div>
        </div>
    );
};

export default LabelRad;
