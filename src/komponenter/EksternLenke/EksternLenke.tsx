import { ReactComponent as TilEkstern } from '@/asset/image/ekstern-lenke.svg';
import Lenke, { Props } from 'nav-frontend-lenker';
import React from 'react';
import './EksternLenke.less';
import { eksternlenkerTrykket } from '../../utils/amplitude-utils';

const EksternLenke: React.FunctionComponent<Props> = (props) => {
    const onClick = () => {
        eksternlenkerTrykket(props.href);
    };

    return (
        <Lenke target="_blank" onClick={onClick} {...props}>
            {props.children}
            <TilEkstern className="ekstern-lenke-icon" />
        </Lenke>
    );
};

export default EksternLenke;
