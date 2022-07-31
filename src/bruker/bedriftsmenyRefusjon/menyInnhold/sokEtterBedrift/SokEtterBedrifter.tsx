import React, { FunctionComponent, useContext } from 'react';
import BEMHelper from '../../../../utils/bem';
import { BedriftvalgType, ClsBedriftsmeny } from '../../api/api';
import './sokEtterBedrifter.less';
import KnappBase from 'nav-frontend-knapper';
import { MenyContext } from '../../BedriftsmenyRefusjon';
import { Element } from 'nav-frontend-typografi';

const SokEtterBedrifter: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.SOK_ETTER_BEDRIFTER);
    const { bedriftvalg, setValgtBedrift, setMenyApen, valgtBedrift, desktopview, setSokefelt, callbackAlleClick } =
        useContext(MenyContext);
    const visSokeknapp: boolean = bedriftvalg.type !== BedriftvalgType.ENKELBEDRIFT && bedriftvalg.valgtOrg?.length > 0;

    return (
        <div>
            <div className={cls.className}>
                <div className={cls.element('container', !visSokeknapp ? 'closed' : '')}>
                    <div className={cls.element('knapp-container')}>
                        {visSokeknapp && (
                            <div className={cls.element('info-og-knapp-wrapper')}>
                                <div className={cls.element('visning-statestikk')}>
                                    {valgtBedrift && desktopview && (
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

                                {!callbackAlleClick && (
                                    <KnappBase
                                        kompakt={false}
                                        type="hoved"
                                        className={cls.element('sok-knapp')}
                                        onClick={() => {
                                            setSokefelt({
                                                aktivt: false,
                                                antallTreff: 0,
                                                organisasjonstreTreff: undefined,
                                            });
                                            setValgtBedrift(bedriftvalg);
                                            setMenyApen(false);
                                        }}
                                    >
                                        Søk
                                    </KnappBase>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SokEtterBedrifter;
