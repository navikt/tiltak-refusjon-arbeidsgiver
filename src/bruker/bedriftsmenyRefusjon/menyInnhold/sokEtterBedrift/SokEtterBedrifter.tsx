import React, { FunctionComponent, useContext } from 'react';
import BEMHelper from '../../../../utils/bem';
import { BedriftvalgType, ClsBedriftsmeny } from '../../api/organisasjon';
import './sokEtterBedrifter.less';
import KnappBase from 'nav-frontend-knapper';
import { MenyContext } from '../../BedriftsmenyRefusjon';

const SokEtterBedrifter: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.SOK_ETTER_BEDRIFTER);
    const { bedriftvalg, setValgtBedrift } = useContext(MenyContext);

    return bedriftvalg.type !== BedriftvalgType.ENKELBEDRIFT && bedriftvalg.valgtOrg?.length > 0 ? (
        <div>
            <div className={cls.className}>
                <div className={cls.element('knapp-container')}>
                    <KnappBase
                        kompakt={false}
                        type="hoved"
                        className={cls.element('sok-knapp')}
                        onClick={() => {
                            setValgtBedrift(bedriftvalg);
                        }}
                    >
                        Søk
                    </KnappBase>
                </div>
            </div>
        </div>
    ) : null;
};

export default SokEtterBedrifter;
