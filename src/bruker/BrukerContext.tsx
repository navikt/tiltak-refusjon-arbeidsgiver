import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LokalLogin from '../LokalLogin';
import Banner from '../refusjon/Banner';
import { hentInnloggetBruker } from '../services/rest-service';
import { BrukerContextType, InnloggetBruker } from './BrukerContextType';
import { XMLHttpReqHandler } from '../services/XMLHttpRequestHandler';
import ManglerRettigheter from '../komponenter/ManglerRettigheter';
import { erUtviklingsmiljo, inneholderVertsnavn } from '../utils/miljoUtils';

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
    const [valgtBedrift, setValgtBedrift] = useState<string | undefined>(undefined);
    const [xmlHttpReq, setXmlHttpReq] = useState<boolean>(false);

    useEffect(() => {
        XMLHttpReqHandler(xmlHttpReq, setXmlHttpReq);
        hentInnloggetBruker()
            .then((response) => setInnloggetBruker(response))
            .catch((err) => console.log('err', err));
    }, [xmlHttpReq]);

    const history = useHistory();

    return (
        <>
            {(erUtviklingsmiljo() || inneholderVertsnavn('labs.nais.io')) && (
                <LokalLogin innloggetBruker={innloggetBruker} />
            )}
            {innloggetBruker && (
                <Banner
                    organisasjoner={innloggetBruker.organisasjoner}
                    setValgtBedrift={(org) => {
                        if (valgtBedrift !== undefined) {
                            history.push({
                                pathname: '/refusjon',
                                search: 'bedrift=' + org.OrganizationNumber,
                            });
                        }
                        setValgtBedrift(org.OrganizationNumber);
                    }}
                />
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
        </>
    );
};
