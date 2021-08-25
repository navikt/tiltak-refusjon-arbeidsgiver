import { ReactComponent as SommerIkon } from '@/asset/image/sommer.svg';
import { ReactComponent as Success } from '@/asset/image/Success.svg';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import EksternLenke from './komponenter/EksternLenke/EksternLenke';
import HvitBoks from './komponenter/hvitboks/HvitBoks';
import VerticalSpacer from './komponenter/VerticalSpacer';

const Landingsside: FunctionComponent = () => {
    const history = useHistory();

    const gåTilOversikten = () => {
        history.push({
            pathname: `/login`,
            search: window.location.search,
        });
    };

    return (
        <HvitBoks style={{ margin: '2rem auto' }}>
            <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SommerIkon />
                    <VerticalSpacer rem={1} />
                    <Innholdstittel>Tiltaksrefusjon</Innholdstittel>
                    <VerticalSpacer rem={3} />
                </div>
                <Normaltekst>
                    Dette er en løsning for søke om refusjon for tilskudd til sommerjobb. Før dere søker må dere:
                </Normaltekst>
                <VerticalSpacer rem={1} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Success style={{ marginRight: '0.5rem' }} />
                        <Element>Ha rapportert inntekter til a-meldingen for perioden dere søker om refusjon.</Element>
                    </div>
                </div>
                <ul>
                    <li>Dette gjøres oftest av de som jobber med lønn og regnskap i din organisasjon.</li>
                </ul>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Success style={{ marginRight: '0.5rem' }} />
                        <Element>
                            Ha bestemt(e) rolle(r) eller rettighet i din virksomheten for å få tilgang til løsningen.
                        </Element>
                    </div>
                </div>
                <ul>
                    <li>
                        Du må ha enkeltrettigheten inntektsmelding eller en av følgende Altinn-rollene for å få tilgang
                        til løsningen:
                    </li>
                    <div style={{ marginLeft: '2rem' }}>
                        <li>ansvarlig revisor</li>
                        <li>lønn og personalmedarbeider</li>
                        <li>regnskapsfører lønn</li>
                        <li>regnskapsfører med signeringsrettighet</li>
                        <li>regnskapsfører uten signeringsrettighet</li>
                        <li>revisormedarbeider</li>
                        <li>norsk representant for utenlandsk enhet</li>
                    </div>
                </ul>
                <Normaltekst>
                    Les mer om{' '}
                    <EksternLenke href="https://www.altinn.no/hjelp/profil/roller-og-rettigheter">
                        roller og rettigheter i Altinn
                    </EksternLenke>
                </Normaltekst>

                <VerticalSpacer rem={2} />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Hovedknapp onClick={gåTilOversikten}>Gå til refusjonsoversikten</Hovedknapp>
                </div>
            </div>
        </HvitBoks>
    );
};

export default Landingsside;
