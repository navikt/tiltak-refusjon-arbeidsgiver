import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import RefusjonFeilet from '../komponenter/refusjonFeilet/RefusjonFeilet';
import LokalLogin from '../LokalLogin';
import Banner from '../refusjon/Banner';
import { hentInnloggetBruker } from '../services/rest-service';
import { XMLHttpReqHandler } from '../services/XMLHttpRequestHandler';
import { erUtviklingsmiljo, inneholderVertsnavn } from '../utils/miljoUtils';
import { Bedriftvalg, BedriftvalgType, initBedriftvalg } from './bedriftsmenyRefusjon/api/organisasjon';
import { BrukerContextType, InnloggetBruker } from './BrukerContextType';
import { NavigateFunction } from 'react-router-dom';

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
    const [valgtBedrift, setValgtBedrift] = useState<Bedriftvalg>(initBedriftvalg);

    const navigate: NavigateFunction = useNavigate();
    const detErValgtBedrift: boolean = valgtBedrift?.valgtOrg?.length !== 0;
    const innloggetBrukerHarAltinnTilgangerBedrifter: boolean = innloggetBruker?.organisasjoner?.length === 0;
    const detFinnesFeilStatusFraMeny: boolean = !!valgtBedrift?.feilstatus;
    const skalRendreRefusjonFeilet: boolean =
        innloggetBrukerHarAltinnTilgangerBedrifter || (detFinnesFeilStatusFraMeny && !detErValgtBedrift);

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
