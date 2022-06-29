import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NavigateFunction } from 'react-router-dom';
import RefusjonFeilet from '../komponenter/refusjonFeilet/RefusjonFeilet';
import LokalLogin from '../LokalLogin';
import Banner from '../refusjon/Banner';
import { hentInnloggetBruker } from '../services/rest-service';
import { XMLHttpReqHandler } from '../services/XMLHttpRequestHandler';
import { useAsyncError } from '../useError';
import { erUtviklingsmiljo, inneholderVertsnavn } from '../utils/miljoUtils';
import { Bedriftvalg, BedriftvalgType, Feilstatus, initvalgtBedrift } from './bedriftsmenyRefusjon/api/organisasjon';
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
    const greideIkkeByggeOrgtre: boolean = !!valgtBedrift?.feilstatus?.find(
        (feil) => feil.status === Feilstatus.GREIDE_IKKE_BYGGE_ORGTRE
    );
    const skalRendreRefusjonFeilet: boolean = innloggetBrukerHarAltinnTilgangerBedrifter || greideIkkeByggeOrgtre;

    const getBedriftSearchkey = (org: Bedriftvalg): string => {
        if (org?.type === BedriftvalgType.ALLEBEDRIFTER) {
            return BedriftvalgType.ALLEBEDRIFTER;
        }
        return org?.valgtOrg.map((o) => o.OrganizationNumber).join(',');
    };

    const setValgtBedriftOgNavigere = (org: Bedriftvalg) => {
        if (valgtBedrift?.valgtOrg) {
            const valgtOrg: string = getBedriftSearchkey(org);
            navigate({
                pathname: window.location.pathname,
                search: 'bedrift=' + valgtOrg,
            });
        }
        setValgtBedrift(org);
    };
    const throwError = useAsyncError();

    useEffect(() => {
        hentInnloggetBruker()
            .then((response) => setInnloggetBruker(response))
            .catch(throwError);
    }, [throwError]);

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
            {skalRendreRefusjonFeilet && <RefusjonFeilet feilstatus={valgtBedrift?.feilstatus} />}
        </XMLHttpReqHandler>
    );
};
