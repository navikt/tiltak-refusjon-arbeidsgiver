import Bedriftsmeny from "@navikt/bedriftsmeny";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import { Action, History, Listener } from "history";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { To } from "react-router-dom";

type Props = {
    organisasjoner: Organisasjon[];
    setValgtBedrift: (org: Organisasjon) => void;
};

const Banner: FunctionComponent<Props> = (props) => {
    const location = useLocation();
    const [listener, setListener] = useState<Listener>();

    useEffect(() => {
        if (listener) {
            listener({ action: Action.Replace, location });
        }
    }, [location, listener]);

    const navigate = useNavigate();

    const fakeHistory: Pick<History, 'listen' | 'replace'> = {
        replace: (to: To) => {
            navigate(to, { replace: true })
        },
        listen: nyListener => {
            return () => {
                setListener(() => nyListener)
            }
        },
    };

    return (
        <Bedriftsmeny
            history={fakeHistory as any}
            organisasjoner={props.organisasjoner}
            onOrganisasjonChange={(org) => {
                props.setValgtBedrift(org);
            }}
            sidetittel="Tiltaksrefusjon"
        />
    );
};

export default Banner;
