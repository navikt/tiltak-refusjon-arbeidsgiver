import React, { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction, useEffect, useState } from 'react';
import BEMHelper from '../../utils/bem';
import TypografiBase from 'nav-frontend-typografi';
import { ReactComponent as NavIkon } from '@/asset/image/navikon.svg';
import Bedriftsmeny from './bedriftsmeny/Bedriftsmeny';
import { byggOrganisasjonstre } from './api/api';
import {
    Bedriftvalg,
    ClsBedriftsmeny,
    initBedriftvalg,
    Juridiskenhet,
    MenyContextType,
    Organisasjon,
} from './api/organisasjon';
import { History } from 'history';
import './bedriftsmenyRefusjon.less';
import { setDefaultBedriftlisteMedApneElementer } from './api/api-Utils';
import { PageData } from '../BrukerContextType';
import useSize from './api/useSize';

interface Props {
    organisasjoner: Organisasjon[];
    valgtBedrift: Bedriftvalg | undefined;
    setValgtBedrift: (org: Bedriftvalg) => void;
    history: History;
    pageData: PageData;
    setPageData: Dispatch<SetStateAction<PageData>>;
}

export const MenyContext = React.createContext<MenyContextType>({} as MenyContextType);

const BedriftsmenyRefusjon: FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
    const cls = BEMHelper(ClsBedriftsmeny.BEDRIFTSMENY_REFUSJON);
    const [organisasjonstre, setOrganisasjonstre] = useState<Array<Juridiskenhet> | undefined>(undefined);
    const [desktopview, setDesktopview] = useState<boolean>(window.innerWidth > 768);
    const [menyApen, setMenyApen] = useState<boolean>(false);
    const { valgtBedrift, setValgtBedrift, organisasjoner, history, pageData, setPageData } = props;
    const [bedriftvalg, setBedriftvalg] = useState<Bedriftvalg>(initBedriftvalg);
    const [bedriftListe, setBedriftListe] = useState<Array<{ index: number; apnet: boolean }> | undefined>(
        organisasjonstre?.map((e, index) => ({ index: index, apnet: false }))
    );

    useEffect(() => {
        if (organisasjoner && organisasjoner?.length > 0) {
            byggOrganisasjonstre(organisasjoner).then((orglist) => {
                if (orglist.length > 0) {
                    setOrganisasjonstre(orglist);
                    setDefaultBedriftlisteMedApneElementer(orglist, setBedriftListe);
                }
            });
        }
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
        pageData,
        setPageData,
        desktopview,
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
