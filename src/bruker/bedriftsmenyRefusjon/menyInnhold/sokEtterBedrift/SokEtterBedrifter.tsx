import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import BEMHelper from '../../../../utils/bem';
import { BedriftvalgType, ClsBedriftsmeny } from '../../api/organisasjon';
import './sokEtterBedrifter.less';
import KnappBase from 'nav-frontend-knapper';
import { MenyContext } from '../../BedriftsmenyRefusjon';
import { Element } from 'nav-frontend-typografi';

const SokEtterBedrifter: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.SOK_ETTER_BEDRIFTER);
    const { bedriftvalg, setValgtBedrift, setMenyApen, valgtBedrift, desktopview } = useContext(MenyContext);
    const visSokeknapp: boolean = bedriftvalg.type !== BedriftvalgType.ENKELBEDRIFT && bedriftvalg.valgtOrg?.length > 0;
    const [visningStatestikk, setVisningStatestikk] = useState<boolean>(false);

    useEffect(() => {
        if (bedriftvalg.valgtOrg === valgtBedrift?.valgtOrg && !visningStatestikk) {
            setVisningStatestikk(true);
        } else if (bedriftvalg.valgtOrg !== valgtBedrift?.valgtOrg && visningStatestikk) {
            setVisningStatestikk(false);
        }
    }, [bedriftvalg, valgtBedrift, visningStatestikk]);

    return (
        <div>
            <div className={cls.className}>
                <div className={cls.element('container', !visSokeknapp ? 'closed' : '')}>
                    <div className={cls.element('knapp-container')}>
                        {visSokeknapp && (
                            <div className={cls.element('info-og-knapp-wrapper')}>
                                <div className={cls.element('visning-statestikk')}>
                                    {visningStatestikk && valgtBedrift && desktopview && (
                                        <>
                                            <Element>
                                                antall refusjoner:
                                                <span className={cls.element('visning-statestikk-data')}>
                                                    {valgtBedrift.pageData.totalItems}
                                                </span>
                                            </Element>
                                            <Element>
                                                nåværende sidevisning:
                                                <span className={cls.element('visning-statestikk-data')}>
                                                    {valgtBedrift.pageData.currentPage + 1}
                                                </span>
                                            </Element>
                                            <Element>
                                                antall sider:
                                                <span className={cls.element('visning-statestikk-data')}>
                                                    {valgtBedrift.pageData.totalPages}
                                                </span>
                                            </Element>
                                        </>
                                    )}
                                </div>
                                <KnappBase
                                    kompakt={false}
                                    type="hoved"
                                    className={cls.element('sok-knapp')}
                                    onClick={() => {
                                        setValgtBedrift(bedriftvalg);
                                        setMenyApen(false);
                                    }}
                                >
                                    Søk
                                </KnappBase>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SokEtterBedrifter;
