import React, { FunctionComponent, PropsWithChildren } from 'react';
import BEMHelper from '../../utils/bem';
import './IkonRad.less';

const cls = BEMHelper('ikonRad');

const IkonRad: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className={cls.className}>{children}</div>;
};
export default IkonRad;
