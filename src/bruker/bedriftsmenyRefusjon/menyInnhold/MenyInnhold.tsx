import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import BEMHelper from '../../../utils/bem';
import { MenyContext } from '../BedriftsmenyRefusjon';

interface Properties {}

const MenyInnhold: FunctionComponent<Properties> = (props: PropsWithChildren<Properties>) => {
    const cls = BEMHelper('bedriftmeny-innhold');
    const context = useContext(MenyContext);

    return (
        <div className={cls.className}>
            <ul>
                {context.organisasjonstre?.map((org) => {
                    return null;
                })}
            </ul>
        </div>
    );
};
export default MenyInnhold;
