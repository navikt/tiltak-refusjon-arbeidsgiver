import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NavigateFunction } from 'react-router-dom';
import RefusjonFeilet from '../komponenter/refusjonFeilet/RefusjonFeilet';
import LokalLogin from '../LokalLogin';
import Banner from '../refusjon/Banner';
import { hentInnloggetBruker } from '../services/rest-service';
import { XMLHttpReqHandler } from '../services/XMLHttpRequestHandler';
import { erUtviklingsmiljo, inneholderVertsnavn } from '../utils/miljoUtils';
import { Bedriftvalg, BedriftvalgType, FeilNivå, initvalgtBedrift } from './bedriftsmenyRefusjon/api/api';
import { BrukerContextType, InnloggetBruker } from './BrukerContextType';

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
    const [valgtBedrift, setValgtBedrift] = useState<Bedriftvalg>(initvalgtBedrift);

    const navigate: NavigateFunction = useNavigate();
    const detErValgtBedrift: boolean = valgtBedrift?.valgtOrg?.length !== 0;
    const innloggetBrukerHarAltinnTilgangerBedrifter: boolean = innloggetBruker?.organisasjoner?.length === 0;
    const greideIkkeByggeOrgtre: boolean = !!valgtBedrift?.feilstatus?.find((feil) => feil.nivå === FeilNivå.ERROR);
    const skalRendreRefusjonFeilet: boolean = innloggetBrukerHarAltinnTilgangerBedrifter || greideIkkeByggeOrgtre;

    const getBedriftSearchkey = (org: Bedriftvalg): string => {
        if (org?.type === BedriftvalgType.ALLEBEDRIFTER) {
            return BedriftvalgType.ALLEBEDRIFTER;
        }
        return org?.valgtOrg.map((o) => o.OrganizationNumber).join(',');
    };

    const setValgtBedriftOgNavigere = (org: Bedriftvalg) => {
        if (valgtBedrift?.valgtOrg) {
            const searchParams = new URLSearchParams(window.location.search);
            const valgtOrg: string = getBedriftSearchkey(org);
            searchParams.set('bedrift', valgtOrg);
            navigate({
                pathname: window.location.pathname,
                search: searchParams.toString(),
            });
        }
        setValgtBedrift(org);
    };

    useEffect(() => {
        hentInnloggetBruker()
            .then((response) => setInnloggetBruker(response))
            .catch((err) => console.log('err', err));
    }, []);

    return (
        <XMLHttpReqHandler>
            {(erUtviklingsmiljo() || inneholderVertsnavn('-labs')) && <LokalLogin innloggetBruker={innloggetBruker} />}
            {innloggetBruker && (
                <Banner
                    organisasjoner={innloggetBruker.organisasjoner}
                    valgtBedrift={valgtBedrift}
                    setValgtBedrift={(org) => setValgtBedriftOgNavigere(org)}
                />
            )}
            {innloggetBruker && detErValgtBedrift && (
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
            {skalRendreRefusjonFeilet && (
                <RefusjonFeilet
                    bedriftvalg={valgtBedrift}
                    innloggetBrukerHarAltinnTilgangerBedrifter={innloggetBrukerHarAltinnTilgangerBedrifter}
                />
            )}
        </XMLHttpReqHandler>
    );
};
