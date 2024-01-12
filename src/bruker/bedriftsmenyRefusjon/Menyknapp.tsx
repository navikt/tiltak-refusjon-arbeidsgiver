import React, { FunctionComponent, useContext } from 'react';
import Underenhet from '@/asset/image/underenhet.svg?react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import BEMHelper from '../../utils/bem';
import { MenyContext } from './BedriftsmenyRefusjon';
import { Bedriftvalg, BedriftvalgType, ClsBedriftsmeny } from './api/api';
import { Label, BodyShort } from '@navikt/ds-react';

const Menyknapp: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.BEDRIFTSMENY);
    const context = useContext(MenyContext);
    const { menyApen, setMenyApen, valgtBedrift } = context;

    const setKnappVisning = (bedrift: Bedriftvalg | undefined): React.ReactNode => {
        switch (bedrift?.type) {
            case BedriftvalgType.ALLEBEDRIFTER:
                return (
                    <>
                        <Label>AlleBedrifter</Label>
                        <BodyShort size="small">Antall valgt {bedrift?.valgtOrg?.length ?? 0}</BodyShort>
                    </>
                );
            case BedriftvalgType.FLEREBEDRIFTER:
                return (
                    <>
                        <Label>Flervalg Bedrift</Label>
                        <BodyShort size="small">Antall valgt {bedrift?.valgtOrg?.length ?? 0}</BodyShort>
                    </>
                );
            case BedriftvalgType.ENKELBEDRIFT:
            default:
                return (
                    <>
                        <Label>{bedrift?.valgtOrg?.[0]?.Name ?? ''}</Label>
                        <BodyShort size="small">{bedrift?.valgtOrg?.[0]?.OrganizationNumber ?? ''}</BodyShort>
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
                <ChevronDownIcon className={cls.element('chevron', menyApen ? 'open' : '')} />
            </div>
        </button>
    );
};
export default Menyknapp;
