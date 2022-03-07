import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ManglerRettigheter from '../komponenter/manglerRettigheter/ManglerRettigheter';
import LokalLogin from '../LokalLogin';
import Banner from '../refusjon/Banner';
import { hentInnloggetBruker } from '../services/rest-service';
import { XMLHttpReqHandler } from '../services/XMLHttpRequestHandler';
import { erUtviklingsmiljo, inneholderVertsnavn } from '../utils/miljoUtils';
import { BrukerContextType, InnloggetBruker } from './BrukerContextType';
import { Bedriftvalg, BedriftvalgType } from './bedriftsmenyRefusjon/api/organisasjon';

const BrukerContext = React.createContext<BrukerContextType | undefined>(undefined);

// hook som sjekker at context er satt før bruk.
export const useInnloggetBruker = () => {
    const context = useContext(BrukerContext);
    if (context === undefined) {
        throw new Error('Kan kun brukes innenfor BrukerProvider');
    }
    return context;
};

export const BrukerProvider: FunctionComponent = (props) => {
    const [innloggetBruker, setInnloggetBruker] = useState<InnloggetBruker>();
    const [valgtBedrift, setValgtBedrift] = useState<Bedriftvalg | undefined>();

    const setValgtBedriftOgNavigere = (org: Bedriftvalg) => {
        if (valgtBedrift && valgtBedrift?.valgtOrg) {
            const valgtOrg: string =
                org?.type === BedriftvalgType.ALLEBEDRIFTER
                    ? BedriftvalgType.ALLEBEDRIFTER
                    : org?.valgtOrg.map((o) => o.OrganizationNumber).join(',');
            navigate({
                pathname: '/refusjon',
                search: 'bedrift=' + valgtOrg,
            });
        }
        setValgtBedrift(org);
    };

    useEffect(() => {
        hentInnloggetBruker()
            .then((response) => setInnloggetBruker(response))
            .catch((err) => console.log('err', err));
    }, []);

    const navigate = useNavigate();

    return (
        <XMLHttpReqHandler>
            {(erUtviklingsmiljo() || inneholderVertsnavn('labs.nais.io')) && (
                <LokalLogin innloggetBruker={innloggetBruker} />
            )}
            {innloggetBruker && (
                <Banner
                    organisasjoner={innloggetBruker.organisasjoner}
                    valgtBedrift={valgtBedrift}
                    setValgtBedrift={(org) => setValgtBedriftOgNavigere(org)}
                />
            )}
            {innloggetBruker && valgtBedrift?.valgtOrg && (
                <BrukerContext.Provider
                    value={{
                        innloggetBruker,
                        valgtBedrift,
                        setValgtBedrift,
                    }}
                >
                    {props.children}
                </BrukerContext.Provider>
            )}
            {innloggetBruker?.organisasjoner?.length === 0 ||
                (valgtBedrift?.feilstatus && (
                    <ManglerRettigheter feilstatus={valgtBedrift?.feilstatus} innloggetBruker={innloggetBruker} />
                ))}
        </XMLHttpReqHandler>
    );
};
