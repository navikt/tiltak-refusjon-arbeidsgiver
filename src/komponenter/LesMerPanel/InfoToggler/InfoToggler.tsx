import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import React from 'react';

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
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className={'infoToggler__label'}>{children}</span>
                {props.åpen && <ChevronUpIcon fontSize={'1.5rem'} />}
                {!props.åpen && <ChevronDownIcon fontSize={'1.5rem'} />}
            </div>
        </button>
    );
};

export default InfoToggler;
