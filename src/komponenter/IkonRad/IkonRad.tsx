import React, { FunctionComponent } from 'react';
import BEMHelper from '../../utils/bem';
import './IkonRad.less';

type Props = {
    children: React.ReactNode;
};

const IkonRad: FunctionComponent<Props> = ({ children }) => {
    const cls = BEMHelper('ikonRad');
    return <div className={cls.className}>{children}</div>;
};
export default IkonRad;
