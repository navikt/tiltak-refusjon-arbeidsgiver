import { Organisasjon } from '@navikt/bedriftsmeny/lib/organisasjon';
import { Action, History, Listener } from 'history';
import React, { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { To } from 'react-router-dom';
import BedriftsmenyRefusjon from '../bruker/bedriftsmenyRefusjon/BedriftsmenyRefusjon';
import { Bedriftvalg } from '../bruker/bedriftsmenyRefusjon/api/organisasjon';
import { PageData } from '../bruker/BrukerContextType';

interface Properties {
    organisasjoner: Array<Organisasjon>;
    valgtBedrift: Bedriftvalg | undefined;
    setValgtBedrift: (org: Bedriftvalg) => void;
    pageData: PageData;
    setPageData: Dispatch<SetStateAction<PageData>>;
}

const Banner: FunctionComponent<Properties> = (props: PropsWithChildren<Properties>) => {
    const location = useLocation();
    const [listener, setListener] = useState<Listener>();
    const { organisasjoner, valgtBedrift, setValgtBedrift, pageData, setPageData } = props;

    useEffect(() => {
        if (listener) {
            listener({ action: Action.Replace, location });
        }
    }, [location, listener]);

    const navigate = useNavigate();

    const fakeHistory: Pick<History, 'listen' | 'replace'> = {
        replace: (to: To) => {
            navigate(to, { replace: true });
        },
        listen: (nyListener) => () => {
            setListener(() => nyListener);
        },
    };

    return (
        <>
            <BedriftsmenyRefusjon
                organisasjoner={organisasjoner}
                valgtBedrift={valgtBedrift}
                setValgtBedrift={setValgtBedrift}
                history={fakeHistory as any}
                pageData={pageData}
                setPageData={setPageData}
            />
        </>
    );
};

export default Banner;
