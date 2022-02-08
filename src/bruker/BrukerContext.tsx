import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ManglerRettigheter from '../komponenter/ManglerRettigheter';
import LokalLogin from '../LokalLogin';
import Banner from '../refusjon/Banner';
import { hentInnloggetBruker } from '../services/rest-service';
import { XMLHttpReqHandler } from '../services/XMLHttpRequestHandler';
import { erUtviklingsmiljo, inneholderVertsnavn } from '../utils/miljoUtils';
import { BrukerContextType, InnloggetBruker, PageData } from './BrukerContextType';
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
    const [valgtBedrift, setValgtBedrift] = useState<Bedriftvalg>();
    const [pageData, setPageData] = useState<PageData>({
        page: 0,
        pagesize: 5,
        currentPage: 0,
        size: 0,
        totalItems: 0,
        totalPages: 0,
    });

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
                                const valgtOrg =
                                    org?.type === BedriftvalgType.ALLEBEDRIFTER
                                        ? BedriftvalgType.ALLEBEDRIFTER
                                        : org?.valgtOrg.map((o) => o.OrganizationNumber).join(',');
                                navigate({
                                    pathname: '/refusjon',
                                    search: 'bedrift=' + valgtOrg,
                                });
                            }
                            setValgtBedrift(org);
                        }}
                        pageData={pageData}
                        setPageData={setPageData}
                    />
                </>
            )}
            {innloggetBruker && valgtBedrift && (
                <BrukerContext.Provider
                    value={{
                        innloggetBruker,
                        valgtBedrift,
                        pageData,
                        setPageData,
                    }}
                >
                    {props.children}
                </BrukerContext.Provider>
            )}
            {innloggetBruker?.organisasjoner?.length === 0 && <ManglerRettigheter />}
        </XMLHttpReqHandler>
    );
};
