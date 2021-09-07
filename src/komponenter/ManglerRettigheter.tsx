import React, { FunctionComponent } from 'react';
import HvitBoks from './hvitboks/HvitBoks';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import VerticalSpacer from './VerticalSpacer';

const ManglerRettigheter: FunctionComponent = () => (
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
);
export default ManglerRettigheter;
