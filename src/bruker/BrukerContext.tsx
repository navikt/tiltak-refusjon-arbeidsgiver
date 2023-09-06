import React, { FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NavigateFunction } from 'react-router-dom';
import LokalLogin from '../LokalLogin';
import RefusjonFeilet from '../komponenter/refusjonFeilet/RefusjonFeilet';
import Banner from '../refusjon/Banner';
import { AutentiseringError, hentInnloggetBruker } from '../services/rest-service';
import { erUtviklingsmiljo, inneholderVertsnavn } from '../utils/miljoUtils';
import { BrukerContextType, InnloggetBruker } from './BrukerContextType';
import { Bedriftvalg, BedriftvalgType, FeilNivå, initvalgtBedrift } from './bedriftsmenyRefusjon/api/api';

const BrukerContext = React.createContext<BrukerContextType | undefined>(undefined);

// hook som sjekker at context er satt før bruk.
export const useInnloggetBruker = () => {
    const context = useContext(BrukerContext);
    if (context === undefined) {
        throw new Error('Kan kun brukes innenfor BrukerProvider');
    }
    return context;
};

export const BrukerProvider: FunctionComponent<PropsWithChildren> = (props) => {
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

    const setValgtBedriftOgNavigere = (org: Bedriftvalg, nullstillFilter: boolean = true) => {
        if (valgtBedrift?.valgtOrg) {
            const searchParams = nullstillFilter ? new URLSearchParams() : new URLSearchParams(window.location.search);
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
            .catch((err) => {
                console.log('err', err);
                if (err instanceof AutentiseringError) {
                    if (!erUtviklingsmiljo()) {
                        window.location.href = '/oauth2/login?redirect=/refusjon';
                    }
                }
            });
    }, []);

    return (
        <>
            {(erUtviklingsmiljo() || inneholderVertsnavn('-labs')) && !innloggetBruker && (
                <LokalLogin innloggetBruker={innloggetBruker} />
            )}
            {innloggetBruker && (
                <Banner
                    organisasjoner={innloggetBruker.organisasjoner}
                    valgtBedrift={valgtBedrift}
                    setValgtBedrift={(org, nullstillFilter = true) => {
                        setValgtBedriftOgNavigere(org, nullstillFilter);
                    }}
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
        </>
    );
};
