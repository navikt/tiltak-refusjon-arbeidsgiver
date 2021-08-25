import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import HvitBoks from '../komponenter/hvitboks/HvitBoks';
import VerticalSpacer from '../komponenter/VerticalSpacer';
import LokalLogin from '../LokalLogin';
import Banner from '../refusjon/Banner';
import { hentInnloggetBruker } from '../services/rest-service';
import { BrukerContextType, InnloggetBruker } from './BrukerContextType';
import { XMLHttpReqHandler } from '../services/XMLHttpRequestHandler';

const BrukerContext = React.createContext<BrukerContextType | undefined>(undefined);

// Egen hook fordi det sjekkes at den blir brukt riktig, og kan ha undefined som defaultValue
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
            {(process.env.NODE_ENV === 'development' || window.location.hostname.includes('labs.nais.io')) && (
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
            {innloggetBruker && innloggetBruker.organisasjoner.length === 0 && (
                <HvitBoks style={{ margin: '1rem auto 2rem auto' }}>
                    <Systemtittel>Ikke tilgang til noen virksomheter i Altinn</Systemtittel>
                    <VerticalSpacer rem={2} />
                    <Normaltekst>
                        For å få tilgang til refusjoner for din virksomhet må du ha en av disse Altinn-rollene:
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <ul>
                        <li>ansvarlig revisor</li>
                        <li>lønn og personalmedarbeider</li>
                        <li>regnskapsfører lønn</li>
                        <li>regnskapsfører med signeringsrettighet</li>
                        <li>regnskapsfører uten signeringsrettighet</li>
                        <li>revisormedarbeider</li>
                        <li>norsk representant for utenlandsk enhet</li>
                    </ul>
                    <VerticalSpacer rem={1} />
                    <Normaltekst>
                        Du kan også ha rettigheten <b>inntektsmelding</b>.
                    </Normaltekst>
                </HvitBoks>
            )}
        </>
    );
};
