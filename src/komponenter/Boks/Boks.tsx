import './Boks.less';
import { Farger } from '../../utils/boksUtils';
import { CSSProperties, FunctionComponent } from 'react';

type Props = {
    children: React.ReactNode;
    className?: string;
    styling?: CSSProperties;
    variant: Farger;
};

const Boks: FunctionComponent<Props> = ({ children, className, styling, variant }) => {
    return (
        <div className={`${variant} ${className || ''}`} style={styling}>
            {children}
        </div>
    );
};
export default Boks;
