import { ReactComponent as Success } from '@/asset/image/Success.svg';
import { ReactComponent as SommerIkon } from '@/asset/image/sommer.svg';
import { BodyShort, Button, Heading, Label, Link } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import EksternLenke from './komponenter/EksternLenke/EksternLenke';
import VerticalSpacer from './komponenter/VerticalSpacer';
import HvitBoks from './komponenter/hvitboks/HvitBoks';

const Landingsside: FunctionComponent = () => {
    const gåTilOversikten = () => {
        window.location.href = '/refusjon';
    };

    return (
        <HvitBoks style={{ margin: '2rem auto' }}>
            <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SommerIkon />
                    <VerticalSpacer rem={1} />
                    <Heading size="large">Tiltaksrefusjon</Heading>
                    <VerticalSpacer rem={2} />
                </div>
                <BodyShort size="small" style={{ marginLeft: '7rem' }}>
                    Dette er en løsning for å søke om refusjon for{' '}
                    <Link href={'https://arbeidsgiver.nav.no/veiviserarbeidsgiver/tiltak/lonnstilskudd'}>
                        lønnstilskudd
                    </Link>
                </BodyShort>
                <BodyShort size="small" style={{ marginLeft: '13.8rem' }}>
                    og <Link href={'https://www.nav.no/arbeidsgiver/sommerjobb'}>tilskudd til sommerjobb</Link>
                </BodyShort>
                <VerticalSpacer rem={2} />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="primary" onClick={gåTilOversikten}>
                        Gå til refusjonsoversikten
                    </Button>
                </div>
                <VerticalSpacer rem={2} />
                <div>
                    <BodyShort size="small">Før dere søker må dere:</BodyShort>
                </div>
                <VerticalSpacer rem={2} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Success style={{ marginRight: '0.5rem' }} />
                        <Label>Ha rapportert inntekter til a-meldingen for perioden dere søker om refusjon.</Label>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <BodyShort size="small" style={{ marginLeft: '1.5rem' }}>
                        Dette gjøres som regel av de som jobber med lønn og regnskap i deres organisasjon.
                    </BodyShort>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Success style={{ marginRight: '0.5rem' }} />
                        <Label>
                            Ha bestemt(e) rolle(r) eller rettighet i deres virksomheten for å få tilgang til løsningen.
                        </Label>
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
                <BodyShort size="small">
                    Les mer om{' '}
                    <EksternLenke href="https://www.altinn.no/hjelp/profil/roller-og-rettigheter">
                        roller og rettigheter i Altinn
                    </EksternLenke>
                </BodyShort>
            </div>
        </HvitBoks>
    );
};

export default Landingsside;
