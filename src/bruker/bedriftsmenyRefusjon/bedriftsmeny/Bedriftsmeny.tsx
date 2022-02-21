import React, { FunctionComponent, PropsWithChildren, useContext, useEffect } from 'react';
import BEMHelper from '../../../utils/bem';
import './bedriftsmeny.less';
import { MenyContext } from '../BedriftsmenyRefusjon';
import useOrganisasjon from '../api/useOrganisasjon';
import MenyInnhold from '../menyInnhold/MenyInnhold';
import Menyknapp from '../Menyknapp';
import { ClsBedriftsmeny } from '../api/organisasjon';
import SokEtterBedrifter from '../menyInnhold/sokEtterBedrift/SokEtterBedrifter';

const Bedriftsmeny: FunctionComponent<{}> = (props: PropsWithChildren<{}>) => {
    const cls = BEMHelper(ClsBedriftsmeny.BEDRIFTSMENY);
    const context = useContext(MenyContext);
    const { history, organisasjonstre, menyApen, valgtBedrift, setValgtBedrift, setBedriftvalg } = context;
    const { hentOrg } = useOrganisasjon(organisasjonstre, history, valgtBedrift, setValgtBedrift, setBedriftvalg);

    useEffect(() => {
        hentOrg();
    }, [hentOrg]);

    return (
        <div className={cls.className}>
            {organisasjonstre && organisasjonstre.length > 0 && (
                <nav>
                    <div className={cls.element('container')}>
                        <Menyknapp />
                        <div className={cls.element('meny-container', menyApen ? 'open' : '')} aria-hidden={!menyApen}>
                            <div className={cls.element('meny-wrapper')}>
                                <MenyInnhold />
                            </div>
                            <SokEtterBedrifter />
                        </div>
                    </div>
                </nav>
            )}
        </div>
    );
};
export default Bedriftsmeny;
