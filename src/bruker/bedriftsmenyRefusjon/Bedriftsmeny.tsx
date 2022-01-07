import React, { FunctionComponent, PropsWithChildren, useContext, useEffect } from 'react';
import BEMHelper from '../../utils/bem';
import './bedriftsmeny.less';
import { MenyContext } from './BedriftsmenyRefusjon';
import useOrganisasjon from './useOrganisasjon';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ReactComponent as Underenhet } from '@/asset/image/underenhet.svg';
import { NedChevron } from 'nav-frontend-chevron';
import MenyInnhold from './menyInnhold/MenyInnhold';

const Bedriftsmeny: FunctionComponent<{}> = (props: PropsWithChildren<{}>) => {
    const cls = BEMHelper('bedriftsmenyRefusjon');
    const context = useContext(MenyContext);
    const { history, organisasjonstre, menyApen, setMenyApen, setValgtBedrift } = context;
    const { hentOrg, valgtOrg } = useOrganisasjon(organisasjonstre, history, setValgtBedrift);

    useEffect(() => {
        hentOrg();
    }, [hentOrg]);

    return (
        <div className={cls.className}>
            {organisasjonstre && organisasjonstre.length > 0 && (
                <nav>
                    <div className={cls.element('container')}>
                        <button
                            className={cls.element('menyknapp')}
                            onClick={() => {
                                setMenyApen((prevState) => !prevState);
                            }}
                        >
                            <div className={cls.element('menyknapp-innhold')}>
                                <Underenhet />
                                <div className={cls.element('knapp-info')}>
                                    <Element>{valgtOrg?.Name ?? ''}</Element>
                                    <Normaltekst>{valgtOrg?.OrganizationNumber ?? ''}</Normaltekst>
                                </div>
                                <NedChevron className={cls.element('chevron')} />
                            </div>
                        </button>
                        <div className={cls.element('meny-container', menyApen ? 'open' : '')} aria-hidden={!menyApen}>
                            <MenyInnhold />
                        </div>
                    </div>
                </nav>
            )}
        </div>
    );
};
export default Bedriftsmeny;
