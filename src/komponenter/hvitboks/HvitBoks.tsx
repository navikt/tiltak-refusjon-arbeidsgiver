import React, { CSSProperties, DetailedHTMLProps, FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react';
import './hvitboks.less';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const HvitBoks: FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
    const styling: CSSProperties = {
        ...props.style,
    };
    return (
        <div style={styling} {...props} className={`hvitboks ${props.className}`}>
            {props.children}
        </div>
    );
};
export default HvitBoks;
