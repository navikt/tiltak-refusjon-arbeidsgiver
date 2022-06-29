import { ReactComponent as SommerIkon } from '@/asset/image/sommer.svg';
import { ReactComponent as Success } from '@/asset/image/Success.svg';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import EksternLenke from './komponenter/EksternLenke/EksternLenke';
import HvitBoks from './komponenter/hvitboks/HvitBoks';
import VerticalSpacer from './komponenter/VerticalSpacer';
import Lenke from 'nav-frontend-lenker';

const Landingsside: FunctionComponent = () => {
    const gåTilOversikten = () => {
        window.location.href = '/login';
    };

    return (
        <HvitBoks style={{ margin: '2rem auto' }}>
            <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SommerIkon />
                    <VerticalSpacer rem={1} />
                    <Innholdstittel>Tiltaksrefusjon</Innholdstittel>
                    <VerticalSpacer rem={2} />
                </div>
                <Normaltekst style={{ marginLeft: '7rem' }}>
                    Dette er en løsning for å søke om refusjon for{' '}
                    <Lenke href={'https://arbeidsgiver.nav.no/veiviserarbeidsgiver/tiltak/lonnstilskudd'}>
                        lønnstilskudd
                    </Lenke>
                </Normaltekst>
                <Normaltekst style={{ marginLeft: '13.8rem' }}>
                    og <Lenke href={'https://arbeidsgiver.nav.no/tiltak/sommerjobb'}>tilskudd til sommerjobb</Lenke>
                </Normaltekst>
                <VerticalSpacer rem={2} />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Hovedknapp onClick={gåTilOversikten}>Gå til refusjonsoversikten</Hovedknapp>
                </div>
                <VerticalSpacer rem={2} />
                <div>
                    <Normaltekst>Før dere søker må dere:</Normaltekst>
                </div>
                <VerticalSpacer rem={2} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Success style={{ marginRight: '0.5rem' }} />
                        <Element>Ha rapportert inntekter til a-meldingen for perioden dere søker om refusjon.</Element>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Normaltekst style={{ marginLeft: '1.5rem' }}>
                        Dette gjøres som regel av de som jobber med lønn og regnskap i deres organisasjon.
                    </Normaltekst>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Success style={{ marginRight: '0.5rem' }} />
                        <Element>
                            Ha bestemt(e) rolle(r) eller rettighet i deres virksomheten for å få tilgang til løsningen.
                        </Element>
                    </div>
                </div>
                <ul>
                    <li>
                        Dere må ha enkeltrettigheten inntektsmelding eller en av følgende Altinn-roller for å få tilgang
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
            </div>
        </HvitBoks>
    );
};

export default Landingsside;
