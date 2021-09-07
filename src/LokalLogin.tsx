import axios from 'axios';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import React, { FunctionComponent, useState } from 'react';
import { InnloggetBruker } from './bruker/BrukerContextType';
import VerticalSpacer from './komponenter/VerticalSpacer';
import { Element } from 'nav-frontend-typografi';
import { inneholderUrlnavn } from './utils/miljoUtils';

type Props = {
    innloggetBruker: InnloggetBruker | undefined;
};

const TOKENX_COOKIE_NAME = `tokenx-token`;

const LokalLogin: FunctionComponent<Props> = (props) => {
    const [pid, setPid] = useState('15000000000');

    const redirectFraLokalLogin = () => (window.location.href = window.location.href.replace('login', 'refusjon'));

    const loggInnKnapp = async (pid: string) => {
        const response = await axios
            .get(`https://tiltak-fakelogin.labs.nais.io/token?aud=aud-tokenx&iss=tokenx&acr=Level4&pid=${pid}`)
            .catch((er) => console.log('error', er));
        if (response) {
            document.cookie = `${TOKENX_COOKIE_NAME}=${response.data};expires=Tue, 15 Jan 2044 21:47:38 GMT;domain=${window.location.hostname};path=/`;
        }
        redirectFraLokalLogin();
    };

    if (props.innloggetBruker !== undefined) {
        if (inneholderUrlnavn('login')) {
            redirectFraLokalLogin();
        }
        return null;
    }

    return (
        <div
            style={{
                minHeight: '30rem',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#F1F1F1',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow:
                        '0 0.9px 1.7px rgb(0 0 0 / 3%), 0 3.1px 5.8px rgb(0 0 0 / 6%), 0 14px 26px rgb(0 0 0 / 13%)',
                    padding: '4rem 6rem',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                }}
            >
                <VerticalSpacer rem={2} />
                <Element>Logg inn med fødselsnummer</Element>
                <VerticalSpacer rem={1} />
                <div style={{ display: 'flex' }}>
                    <Input
                        placeholder="Logg inn som"
                        value={pid}
                        onChange={(event) => setPid(event.currentTarget.value)}
                    />
                    <Hovedknapp style={{ marginLeft: '0.5rem' }} disabled={!pid} onClick={() => loggInnKnapp(pid)}>
                        Logg inn
                    </Hovedknapp>
                </div>
                <VerticalSpacer rem={2} />
            </div>
        </div>
    );
};

export default LokalLogin;
