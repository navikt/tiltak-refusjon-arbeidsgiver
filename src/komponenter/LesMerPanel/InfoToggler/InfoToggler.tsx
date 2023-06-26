import React from 'react';
import { ChevronUpIcon } from '@navikt/aksel-icons';

import './infoToggler.less';

interface Props {
    children: React.ReactNode;
    onToggle: () => void;
    åpen?: boolean;
}

const InfoToggler = (props: Props) => {
    const { åpen = false, children, onToggle } = props;
    return (
        <button
            className={'infoToggler'}
            type="button"
            onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
                evt.stopPropagation();
                evt.preventDefault();
                onToggle();
            }}
            aria-expanded={åpen}
        >
            <span className={'infoToggler__label'}>{children}</span>
            <ChevronUpIcon type={åpen ? 'opp' : 'ned'} />
        </button>
    );
};

export default InfoToggler;
