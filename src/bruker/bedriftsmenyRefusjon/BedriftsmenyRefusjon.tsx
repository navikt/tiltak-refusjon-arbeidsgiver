import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import BEMHelper from '../../utils/bem';
import NavIkon from '@/asset/image/navikon.svg?react';
import Bedriftsmeny from './bedriftsmeny/Bedriftsmeny';
import { OrganisasjonData, konstruereOrganisasjonliste } from './api/konstruer';
import {
    Bedriftvalg,
    ClsBedriftsmeny,
    MenyContextType,
    Organisasjon,
    Sokefelt,
    initBedriftvalg,
    Organisasjonlist,
} from './api/api';
import { History } from 'history';
import './bedriftsmenyRefusjon.less';
import { setDefaultBedriftlisteMedApneElementer } from './api/kontruer-Utils';
import useSize from './api/useSize';
import { Heading } from '@navikt/ds-react';

interface Props {
    organisasjoner: Organisasjon[];
    valgtBedrift: Bedriftvalg | undefined;
    setValgtBedrift: (org: Bedriftvalg) => void;
    history: History;
    sendCallbackAlleClick: boolean;
}

export const MenyContext = React.createContext<MenyContextType>({} as MenyContextType);

const BedriftsmenyRefusjon: FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
    const cls = BEMHelper(ClsBedriftsmeny.BEDRIFTSMENY_REFUSJON);
    const [organisasjonstre, setOrganisasjonstre] = useState<Organisasjonlist | undefined>(undefined);
    const [desktopview, setDesktopview] = useState<boolean>(window.innerWidth > 768);
    const [menyApen, setMenyApen] = useState<boolean>(false);
    const [sokefelt, setSokefelt] = useState<Sokefelt>({
        aktivt: false,
        sokeord: '',
        antallTreff: 0,
        organisasjonstreTreff: undefined,
        fultOrganisasjonstre: undefined,
    });
    const { valgtBedrift, setValgtBedrift, organisasjoner, history, sendCallbackAlleClick } = props;
    const [callbackAlleClick] = useState<boolean>(sendCallbackAlleClick);
    const [bedriftvalg, setBedriftvalg] = useState<Bedriftvalg>(initBedriftvalg);
    const [bedriftListe, setBedriftListe] = useState<Array<{ index: number; apnet: boolean }> | undefined>(
        organisasjonstre?.list.map((e, index) => ({ index: index, apnet: false }))
    );

    useEffect(() => {
        if (organisasjoner && organisasjoner?.length > 0) {
            konstruereOrganisasjonliste(organisasjoner).then((orglist: OrganisasjonData) => {
                if (
                    orglist.organisasjonliste.length > 0 &&
                    (typeof organisasjonstre !== 'object' || organisasjonstre?.list.length === 0)
                ) {
                    setOrganisasjonstre({ list: orglist.organisasjonliste, feilstatus: orglist.feilstatus });
                    setDefaultBedriftlisteMedApneElementer(orglist.organisasjonliste, setBedriftListe);
                }
            });
        }
        // eslint-disable-next-line
    }, [organisasjoner]);

    useSize({ desktopview, setDesktopview });

    const contextData: MenyContextType = {
        valgtBedrift,
        setValgtBedrift,
        organisasjoner,
        history,
        organisasjonstre,
        setOrganisasjonstre,
        menyApen,
        setMenyApen,
        bedriftvalg,
        setBedriftvalg,
        bedriftListe,
        setBedriftListe,
        desktopview,
        sokefelt,
        setSokefelt,
        callbackAlleClick,
    };

    return (
        <div role="banner" className={cls.className}>
            <div className={cls.element('wrapper')}>
                <div className={cls.element('container')}>
                    <div className={cls.element('brand')}>
                        <div>
                            <NavIkon />
                        </div>
                        {desktopview && (
                            <Heading size="medium" className={cls.element('tittel')}>
                                Tiltaksrefusjon
                            </Heading>
                        )}
                    </div>
                    <div className={cls.element('innhold')}>
                        <MenyContext.Provider value={contextData}>
                            <Bedriftsmeny />
                        </MenyContext.Provider>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BedriftsmenyRefusjon;
