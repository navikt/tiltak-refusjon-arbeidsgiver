import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import BEMHelper from '../../utils/bem';
import TypografiBase from 'nav-frontend-typografi';
import { ReactComponent as NavIkon } from '@/asset/image/navikon.svg';
import Bedriftsmeny from './bedriftsmeny/Bedriftsmeny';
import { ByggOrganisasjonstre, byggOrganisasjonstre } from './api/api';
import {
    Bedriftvalg,
    ClsBedriftsmeny,
    initvalgtBedrift,
    Juridiskenhet,
    MenyContextType,
    Organisasjon,
    Sokefelt,
    initBedriftvalg,
} from './api/organisasjon';
import { History } from 'history';
import './bedriftsmenyRefusjon.less';
import { setDefaultBedriftlisteMedApneElementer } from './api/api-Utils';
import useSize from './api/useSize';

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
    const [organisasjonstre, setOrganisasjonstre] = useState<Array<Juridiskenhet> | undefined>(undefined);
    const [desktopview, setDesktopview] = useState<boolean>(window.innerWidth > 768);
    const [menyApen, setMenyApen] = useState<boolean>(false);
    const [sokefelt, setSokefelt] = useState<Sokefelt>({
        aktivt: false,
        antallTreff: 0,
        organisasjonstreTreff: undefined,
    });
    const { valgtBedrift, setValgtBedrift, organisasjoner, history, sendCallbackAlleClick } = props;
    const [callbackAlleClick] = useState<boolean>(sendCallbackAlleClick);
    const [bedriftvalg, setBedriftvalg] = useState<Bedriftvalg>(initBedriftvalg);
    const [bedriftListe, setBedriftListe] = useState<Array<{ index: number; apnet: boolean }> | undefined>(
        organisasjonstre?.map((e, index) => ({ index: index, apnet: false }))
    );

    useEffect(() => {
        if (organisasjoner && organisasjoner?.length > 0) {
            byggOrganisasjonstre(organisasjoner).then((orglist: ByggOrganisasjonstre) => {
                if (orglist.juridisk.length > 0) {
                    setOrganisasjonstre(orglist.juridisk);
                    setDefaultBedriftlisteMedApneElementer(orglist.juridisk, setBedriftListe);
                }
                if (
                    orglist.feilstatus &&
                    (!valgtBedrift ||
                        (valgtBedrift &&
                            orglist?.feilstatus?.filter((feil) =>
                                orglist?.feilstatus?.find((f) => f.status !== feil.status)
                            )?.length < 0))
                ) {
                    setValgtBedrift(
                        Object.assign({}, valgtBedrift, {
                            type: valgtBedrift?.type ?? initvalgtBedrift.type,
                            valgtOrg: valgtBedrift?.valgtOrg ?? initvalgtBedrift.valgtOrg,
                            pageData: valgtBedrift?.pageData ?? initvalgtBedrift.pageData,
                            feilstatus: orglist.feilstatus,
                        })
                    );
                }
            });
        }
    }, [organisasjoner, valgtBedrift, setValgtBedrift]);

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
        <div className={cls.className}>
            <div className={cls.element('wrapper')}>
                <div className={cls.element('container')}>
                    <div className={cls.element('brand')}>
                        <div>
                            <NavIkon />
                        </div>
                        {desktopview && (
                            <TypografiBase className={cls.element('tittel')} type="systemtittel">
                                Tiltaksrefusjon
                            </TypografiBase>
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
