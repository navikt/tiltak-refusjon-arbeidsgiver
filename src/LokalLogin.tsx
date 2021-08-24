import axios from 'axios';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import React, { FunctionComponent, useState } from 'react';
import { InnloggetBruker } from './bruker/BrukerContextType';
import VerticalSpacer from './komponenter/VerticalSpacer';
import { Element } from 'nav-frontend-typografi';

type Props = {
    innloggetBruker: InnloggetBruker | undefined;
};

const TOKENX_COOKIE_NAME = `tokenx-token`;

const LokalLogin: FunctionComponent<Props> = (props) => {
    console.log('bruker props', props);
    const [pid, setPid] = useState('15000000000');

    const loggInnKnapp = async (pid: string) => {
        console.log('init kall mot fake login', pid);
        const response = await axios
            .get(`https://tiltak-fakelogin.labs.nais.io/token?aud=aud-tokenx&iss=tokenx&acr=Level4&pid=${pid}`)
            .catch((er) => console.log('error', er));
        console.log('res', response);
        if (response) {
            document.cookie = `${TOKENX_COOKIE_NAME}=${response.data};expires=Tue, 15 Jan 2044 21:47:38 GMT;domain=${window.location.hostname};path=/`;
        }
        window.location.reload();
    };

    if (props.innloggetBruker !== undefined) {
        return null;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <VerticalSpacer rem={2} />
            <Element>Logg inn med fødselsnummer</Element>
            <VerticalSpacer rem={1} />
            <div style={{ display: 'flex' }}>
                <Input placeholder="Logg inn som" value={pid} onChange={(event) => setPid(event.currentTarget.value)} />
                <Hovedknapp style={{ marginLeft: '0.5rem' }} disabled={!pid} onClick={() => loggInnKnapp(pid)}>
                    Logg inn
                </Hovedknapp>
            </div>
            <VerticalSpacer rem={2} />
        </div>
    );
};

export default LokalLogin;
