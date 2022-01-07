import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ManglerRettigheter from '../komponenter/ManglerRettigheter';
import LokalLogin from '../LokalLogin';
import Banner from '../refusjon/Banner';
import { hentInnloggetBruker } from '../services/rest-service';
import { XMLHttpReqHandler } from '../services/XMLHttpRequestHandler';
import { erUtviklingsmiljo, inneholderVertsnavn } from '../utils/miljoUtils';
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
    const [valgtBedrift, setValgtBedrift] = useState<string | undefined>();

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
                <>
                    {' '}
                    <Banner
                        identifikator={innloggetBruker.identifikator}
                        organisasjoner={innloggetBruker.organisasjoner}
                        valgtBedrift={valgtBedrift}
                        setValgtBedrift={(org) => {
                            if (valgtBedrift !== undefined) {
                                navigate({
                                    pathname: '/refusjon',
                                    search: 'bedrift=' + org.OrganizationNumber,
                                });
                            }
                            setValgtBedrift(org.OrganizationNumber);
                        }}
                    />
                </>
            )}
            {innloggetBruker && valgtBedrift && (
                <BrukerContext.Provider
                    value={{
                        innloggetBruker,
                        valgtBedrift,
                    }}
                >
                    {props.children}
                </BrukerContext.Provider>
            )}
            {innloggetBruker?.organisasjoner?.length === 0 && <ManglerRettigheter />}
        </XMLHttpReqHandler>
    );
};
