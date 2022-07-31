import React, { FunctionComponent, useContext } from 'react';
import { ReactComponent as Underenhet } from '@/asset/image/underenhet.svg';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { NedChevron } from 'nav-frontend-chevron';
import BEMHelper from '../../utils/bem';
import { MenyContext } from './BedriftsmenyRefusjon';
import { Bedriftvalg, BedriftvalgType, ClsBedriftsmeny } from './api/api';

const Menyknapp: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.BEDRIFTSMENY);
    const context = useContext(MenyContext);
    const { menyApen, setMenyApen, valgtBedrift } = context;

    const setKnappVisning = (bedrift: Bedriftvalg | undefined): React.ReactNode => {
        switch (bedrift?.type) {
            case BedriftvalgType.ALLEBEDRIFTER:
                return (
                    <>
                        <Element>AlleBedrifter</Element>
                        <Normaltekst>Antall valgt {bedrift?.valgtOrg?.length ?? 0}</Normaltekst>
                    </>
                );
            case BedriftvalgType.FLEREBEDRIFTER:
                return (
                    <>
                        <Element>Flervalg Bedrift</Element>
                        <Normaltekst>Antall valgt {bedrift?.valgtOrg?.length ?? 0}</Normaltekst>
                    </>
                );
            case BedriftvalgType.ENKELBEDRIFT:
            default:
                return (
                    <>
                        <Element>{bedrift?.valgtOrg?.[0]?.Name ?? ''}</Element>
                        <Normaltekst>{bedrift?.valgtOrg?.[0]?.OrganizationNumber ?? ''}</Normaltekst>
                    </>
                );
        }
    };

    return (
        <button
            className={cls.element('menyknapp')}
            onClick={() => {
                setMenyApen((prevState) => !prevState);
            }}
        >
            <div className={cls.element('menyknapp-innhold')}>
                <Underenhet />
                <div className={cls.element('knapp-info')}>{setKnappVisning(valgtBedrift)}</div>
                <NedChevron className={cls.element('chevron', menyApen ? 'open' : '')} />
            </div>
        </button>
    );
};
export default Menyknapp;
