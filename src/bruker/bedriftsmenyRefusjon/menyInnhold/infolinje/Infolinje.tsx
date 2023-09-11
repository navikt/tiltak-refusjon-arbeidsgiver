import React, { FunctionComponent, useContext } from 'react';
import BEMHelper from '../../../../utils/bem';
import { BedriftvalgType, ClsBedriftsmeny } from '../../api/api';
import './infolinje.less';
import { MenyContext } from '../../BedriftsmenyRefusjon';
import { Label, Button } from '@navikt/ds-react';

const Infolinje: FunctionComponent = () => {
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
                                            <Label>
                                                Antall refusjoner:
                                                <span className={cls.element('visning-statestikk-data')}>
                                                    {valgtBedrift.pageData.totalItems}
                                                </span>
                                            </Label>
                                            <Label>
                                                Nåværende sidevisning:
                                                <span className={cls.element('visning-statestikk-data')}>
                                                    {valgtBedrift.pageData.currentPage + 1}
                                                </span>
                                            </Label>
                                            <Label>
                                                Antall sider:
                                                <span className={cls.element('visning-statestikk-data')}>
                                                    {valgtBedrift.pageData.totalPages}
                                                </span>
                                            </Label>
                                        </>
                                    )}
                                </div>

                                {!callbackAlleClick && (
                                    <Button
                                        className={cls.element('sok-knapp')}
                                        onClick={() => {
                                            setSokefelt({
                                                aktivt: false,
                                                sokeord: '',
                                                antallTreff: 0,
                                                organisasjonstreTreff: undefined,
                                                fultOrganisasjonstre: undefined,
                                            });
                                            setValgtBedrift(bedriftvalg);
                                            setMenyApen(false);
                                        }}
                                    >
                                        Søk
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Infolinje;
