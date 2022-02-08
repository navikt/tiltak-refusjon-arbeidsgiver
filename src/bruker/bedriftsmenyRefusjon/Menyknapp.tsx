import React, { FunctionComponent, useContext } from 'react';
import { ReactComponent as Underenhet } from '@/asset/image/underenhet.svg';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { NedChevron } from 'nav-frontend-chevron';
import BEMHelper from '../../utils/bem';
import { MenyContext } from './BedriftsmenyRefusjon';
import { ClsBedriftsmeny } from './api/organisasjon';

const Menyknapp: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.BEDRIFTSMENY);
    const context = useContext(MenyContext);
    const { menyApen, setMenyApen, valgtBedrift } = context;

    return (
        <button
            className={cls.element('menyknapp')}
            onClick={() => {
                setMenyApen((prevState) => !prevState);
            }}
        >
            <div className={cls.element('menyknapp-innhold')}>
                <Underenhet />
                <div className={cls.element('knapp-info')}>
                    <Element>{valgtBedrift?.valgtOrg?.[0]?.Name ?? ''}</Element>
                    <Normaltekst>{valgtBedrift?.valgtOrg?.[0]?.OrganizationNumber ?? ''}</Normaltekst>
                </div>
                <NedChevron className={cls.element('chevron', menyApen ? 'open' : '')} />
            </div>
        </button>
    );
};
export default Menyknapp;
