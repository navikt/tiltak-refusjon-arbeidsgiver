import { FunctionComponent } from 'react';
import BEMHelper from '../../utils/bem';
import './GreyFrame.less';

type Props = {
    children: React.ReactNode;
};

const GreyFrame: FunctionComponent<Props> = ({ children }) => {
    const cls = BEMHelper('greyFrame');
    return <div className={cls.className}>{children}</div>;
};
export default GreyFrame;
