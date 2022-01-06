import React, { FunctionComponent, PropsWithChildren, useContext, useEffect } from 'react';
import BEMHelper from '../../utils/bem';
import './bedriftsmeny.less';
import { MenyContext } from './BedriftsmenyRefusjon';
import useOrganisasjon from '@navikt/bedriftsmeny/lib/Virksomhetsvelger/utils/useOrganisasjon';

const Bedriftsmeny: FunctionComponent<{}> = (props: PropsWithChildren<{}>) => {
    const cls = BEMHelper('bedriftsmenyRefusjon');
    const context = useContext(MenyContext);
    const { history, organisasjonstre } = context;
    const { valgtOrganisasjon } = useOrganisasjon(organisasjonstre, history);

    useEffect(() => {});

    return (
        <div className={cls.className}>
            {organisasjonstre && organisasjonstre.length > 0 && (
                <nav>
                    <div className={cls.element('container')}>
                        <button className={cls.element('menyknapp')}>
                            <div className={cls.element('menyknapp-innhold')}>{}</div>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
};
export default Bedriftsmeny;
