import axios from 'axios';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import React, { FunctionComponent, useState } from 'react';
import { InnloggetBruker } from './bruker/BrukerContextType';
import { Element } from 'nav-frontend-typografi';
import { inneholderUrlnavn } from './utils/miljoUtils';
import BEMHelper from './utils/bem';
import './lokalLogin.less';
import { useAsyncError } from './useError';

type Props = {
    innloggetBruker: InnloggetBruker | undefined;
};

const TOKENX_COOKIE_NAME = `tokenx-token`;

const LokalLogin: FunctionComponent<Props> = (props) => {
    const [pid, setPid] = useState('15000000000');
    const cls = BEMHelper('login');

    const redirectFraLokalLogin = () => (window.location.href = window.location.href.replace('login', 'refusjon'));
    const throwError = useAsyncError();

    const loggInnKnapp = async (pid: string) => {
        const response = await axios
            .get(`https://tiltak-fakelogin.labs.nais.io/token?aud=aud-tokenx&iss=tokenx&acr=Level4&pid=${pid}`)
            .catch(throwError);
        if (response && response.status === 200) {
            document.cookie = `${TOKENX_COOKIE_NAME}=${response.data};expires=Tue, 15 Jan 2044 21:47:38 GMT;domain=${window.location.hostname};path=/`;
            redirectFraLokalLogin();
        }
    };

    if (props.innloggetBruker !== undefined) {
        if (inneholderUrlnavn('login')) {
            redirectFraLokalLogin();
        }
        return null;
    }

    return (
        <div className={cls.className}>
            <div className={cls.element('boks')}>
                <Element>Logg inn med fødselsnummer</Element>
                <div className={cls.element('input-wrapper')}>
                    <Input
                        placeholder="Logg inn som"
                        value={pid}
                        onChange={(event) => setPid(event.currentTarget.value)}
                    />
                    <Hovedknapp
                        className={cls.element('submit-knapp')}
                        disabled={!pid}
                        onClick={() => loggInnKnapp(pid)}
                    >
                        Logg inn
                    </Hovedknapp>
                </div>
            </div>
        </div>
    );
};
export default LokalLogin;
