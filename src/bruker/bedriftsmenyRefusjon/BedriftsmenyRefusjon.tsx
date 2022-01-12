import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import BEMHelper from '../../utils/bem';
import TypografiBase, { Element } from 'nav-frontend-typografi';
import { ReactComponent as NavIkon } from '@/asset/image/navikon.svg';
import Bedriftsmeny from './Bedriftsmeny';
import './bedriftsmenyRefusjon.less';
import { Organisasjon } from '@navikt/bedriftsmeny/lib/organisasjon';
import { byggOrganisasjonstre } from './api/api';
import { Bedriftvalg, initBedriftvalg, Juridiskenhet, MenyContextType } from './organisasjon';
import { History } from 'history';

interface Props {
    identifikator: string;
    organisasjoner: Organisasjon[];
    valgtBedrift: string | undefined;
    setValgtBedrift: (org: Organisasjon) => void;
    history: History;
}

export const MenyContext = React.createContext<MenyContextType>({} as MenyContextType);

const BedriftsmenyRefusjon: FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
    const cls = BEMHelper('bedriftsmeny-refusjon');
    const [organisasjonstre, setOrganisasjonstre] = useState<Array<Juridiskenhet> | undefined>(undefined);
    const [menyApen, setMenyApen] = useState<boolean>(false);
    const [bedriftvalg, setBedriftvalg] = useState<Bedriftvalg>(initBedriftvalg);
    const { valgtBedrift, setValgtBedrift, identifikator, organisasjoner, history } = props;

    useEffect(() => {
        if (organisasjoner && organisasjoner?.length > 0) {
            byggOrganisasjonstre(organisasjoner).then((orglist) => {
                if (orglist.length > 0) {
                    setOrganisasjonstre(orglist);
                }
            });
        }
    }, [organisasjoner]);

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
    };

    return (
        <div className={cls.className}>
            <div className={cls.element('wrapper')}>
                <div className={cls.element('container')}>
                    <div className={cls.element('brand')}>
                        <div>
                            <NavIkon />
                        </div>
                        <TypografiBase className={cls.element('tittel')} type="systemtittel">
                            Tiltaksrefusjon
                        </TypografiBase>
                    </div>
                    <div className={cls.element('innhold')}>
                        <div className={cls.element('bruker')}>
                            <Element>innlogget bruker</Element>
                            <Element>{identifikator}</Element>
                        </div>
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
