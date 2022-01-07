import Bedriftsmeny from '@navikt/bedriftsmeny';
import { Organisasjon } from '@navikt/bedriftsmeny/lib/organisasjon';
import { Action, History, Listener } from 'history';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { To } from 'react-router-dom';
import BedriftsmenyRefusjon from '../bruker/bedriftsmenyRefusjon/BedriftsmenyRefusjon';

type Props = {
    identifikator: string;
    organisasjoner: Organisasjon[];
    valgtBedrift: string | undefined;
    setValgtBedrift: (org: Organisasjon) => void;
};

const Banner: FunctionComponent<Props> = (props) => {
    const location = useLocation();
    const [listener, setListener] = useState<Listener>();
    const { identifikator, organisasjoner, valgtBedrift, setValgtBedrift } = props;

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
        listen: (nyListener) => {
            return () => {
                setListener(() => nyListener);
            };
        },
    };

    return (
        <>
            <BedriftsmenyRefusjon
                identifikator={identifikator}
                organisasjoner={organisasjoner}
                valgtBedrift={valgtBedrift}
                setValgtBedrift={setValgtBedrift}
                history={fakeHistory as any}
            />
            <Bedriftsmeny
                history={fakeHistory as any}
                organisasjoner={props.organisasjoner}
                onOrganisasjonChange={(org) => {
                    props.setValgtBedrift(org);
                }}
                sidetittel="Tiltaksrefusjon"
            />
        </>
    );
};

export default Banner;
