import Bedriftsmeny from '@navikt/bedriftsmeny';
import { Organisasjon } from '@navikt/bedriftsmeny/lib/organisasjon';
import { History, Listener } from 'history';
import React, { FunctionComponent, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

type Props = {
    organisasjoner: Organisasjon[];
    setValgtBedrift: (org: Organisasjon) => void;
};

const Banner: FunctionComponent<Props> = (props) => {

    const location = useLocation()
    useEffect(() => {
        
    }, [location])

    const navigate = useNavigate();

    const fakeHistory: Pick<History, 'listen' | 'replace'> = {
        replace: (url: string) =>  navigate(url, {replace: true}),
        listen: (listener: Listener) => () => {
            console.log('hehe');
            
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
