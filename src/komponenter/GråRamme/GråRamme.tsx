import { FunctionComponent, PropsWithChildren } from 'react';
import BEMHelper from '../../utils/bem';
import './GråRamme.less';

const cls = BEMHelper('greyFrame');

const GråRamme: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className={cls.className}>{children}</div>;
};
export default GråRamme;
