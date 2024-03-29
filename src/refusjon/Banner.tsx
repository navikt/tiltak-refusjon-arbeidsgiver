import { Organisasjon } from '@navikt/bedriftsmeny/lib/types/organisasjon';
import { History } from 'history';
import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { To } from 'react-router-dom';
import BedriftsmenyRefusjon from '../bruker/bedriftsmenyRefusjon/BedriftsmenyRefusjon';
import { Bedriftvalg } from '../bruker/bedriftsmenyRefusjon/api/api';

interface Properties {
    organisasjoner: Array<Organisasjon>;
    valgtBedrift: Bedriftvalg | undefined;
    setValgtBedrift: (org: Bedriftvalg) => void;
}

const Banner: FunctionComponent<Properties> = (props: PropsWithChildren<Properties>) => {
    const location = useLocation();
    const [listener, setListener] = useState<any>();
    const { organisasjoner, valgtBedrift, setValgtBedrift } = props;

    useEffect(() => {
        if (listener) {
            listener({ action: 'REPLACE', location });
        }
    }, [location, listener]);

    const navigate = useNavigate();

    const customHistory: Pick<History, 'listen' | 'replace'> = {
        replace: (to: To) => {
            navigate(to, { replace: true });
        },
        listen: (nyListener) => () => {
            setListener(() => nyListener);
        },
    };

    return (
        <BedriftsmenyRefusjon
            organisasjoner={organisasjoner}
            valgtBedrift={valgtBedrift}
            setValgtBedrift={setValgtBedrift}
            history={customHistory as any}
            sendCallbackAlleClick={true}
        />
    );
};

export default Banner;
