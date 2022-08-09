import React from 'react';
import BEMHelper from '../../utils/bem';
import { Element } from 'nav-frontend-typografi';

interface Props {
    className: string;
}

const LabelRad = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('label-rad')} aria-label="rad overkrifter for kolonnene i refusonslisten">
            <div className={cls.element('kolonne')} id={cls.element('deltaker')}>
                <Element className={cls.element('deltaker')}>Deltaker</Element>
            </div>
            <div className={cls.element('kolonne')} id={cls.element('periode')}>
                <Element className={cls.element('periode')}>Periode</Element>
            </div>
            <div className={cls.element('kolonne')} id={cls.element('status')}>
                <Element className={cls.element('status')}>Status</Element>
            </div>
            <div className={cls.element('kolonne')} id={cls.element('frist-godkjenning')}>
                <Element className={cls.element('frist-godkjenning')}>Frist for godkjenning</Element>
            </div>
        </div>
    );
};

export default LabelRad;
