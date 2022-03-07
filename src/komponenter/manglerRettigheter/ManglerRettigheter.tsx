import React, { FunctionComponent, PropsWithChildren } from 'react';
import HvitBoks from '../hvitboks/HvitBoks';
import { Normaltekst, Systemtittel, Undertittel, Element } from 'nav-frontend-typografi';
import { Feilstatus } from '../../bruker/bedriftsmenyRefusjon/api/organisasjon';
import { InnloggetBruker } from '../../bruker/BrukerContextType';
import { ReactComponent as SystemError } from '@/asset/image/systemError.svg';
import { ReactComponent as ChevronRight } from '@/asset/image/chevronRight.svg';
import { ReactComponent as JuridiskEnhet } from '@/asset/image/juridiskEnhet2.svg';
import { ReactComponent as Notes } from '@/asset/image/notes.svg';
import BEMHelper from '../../utils/bem';
import './manglerRettigheter.less';
import Lenke from 'nav-frontend-lenker';

interface Props {
    feilstatus: Feilstatus | undefined;
    innloggetBruker: InnloggetBruker | undefined;
}

interface LagNyRadProps {
    navn: string;
    verdi: string;
    navnIcon?: React.ReactNode;
    verdiIcon?: React.ReactNode;
}

const ManglerRettigheter: FunctionComponent<Props> = ({ feilstatus, innloggetBruker }: PropsWithChildren<Props>) => {
    const cls = BEMHelper('manglerRettigheter');

    const LagNyRad: FunctionComponent<LagNyRadProps> = ({ navn, verdi, navnIcon, verdiIcon }: LagNyRadProps) => (
        <div className={cls.element('rad')}>
            <div>
                {navnIcon}
                <Element>{navn}</Element>
            </div>
            <div>
                {verdiIcon}
                <Normaltekst>{verdi}</Normaltekst>
            </div>
        </div>
    );

    const GenerellTilgangsInnhold: FunctionComponent = () => (
        <>
            <Normaltekst className={cls.element('tittel')}>
                For å få tilgang til refusjoner for din virksomhet må du ha en av disse Altinn-rollene:
            </Normaltekst>
            <ul className={cls.element('liste')}>
                <li>ansvarlig revisor</li>
                <li>lønn og personalmedarbeider</li>
                <li>regnskapsfører lønn</li>
                <li>regnskapsfører med signeringsrettighet</li>
                <li>regnskapsfører uten signeringsrettighet</li>
                <li>revisormedarbeider</li>
                <li>norsk representant for utenlandsk enhet</li>
            </ul>
            <Normaltekst>
                Du kan også ha rettigheten <b>inntektsmelding</b>.
            </Normaltekst>
        </>
    );

    switch (feilstatus) {
        case Feilstatus.JURIDISK_MANGLER_UNDERENHET:
            return (
                <HvitBoks className={cls.className}>
                    <div className={cls.element('mangler-underenhet-wrapper')}>
                        <div className={cls.element('header')}>
                            <Undertittel>
                                Du har tilganger til en eller flere bedrifter, men kun på juridisk nivå.
                            </Undertittel>
                            <div className={cls.element('ikon')}>
                                <SystemError width={24} height={24} />
                            </div>
                        </div>
                        {innloggetBruker?.organisasjoner?.map((org) => (
                            <>
                                <LagNyRad
                                    navn="Bedriftnavn:"
                                    verdi={org.Name ?? ''}
                                    navnIcon={<JuridiskEnhet width={20} height={20} />}
                                    verdiIcon={<ChevronRight width={20} height={20} />}
                                />
                                <LagNyRad
                                    navn="Type bedrift:"
                                    verdi={org.Type === 'Enterprise' ? 'Juridisk overenhet' : 'Underenhet'}
                                    navnIcon={<Notes width={20} height={20} />}
                                    verdiIcon={<ChevronRight width={20} height={20} />}
                                />
                                <LagNyRad
                                    navn="Organisasjonsnummer:"
                                    verdi={org.OrganizationNumber ?? ''}
                                    navnIcon={<Notes width={20} height={20} />}
                                    verdiIcon={<ChevronRight width={20} height={20} />}
                                />
                                <LagNyRad
                                    navn="Juridisk underenheter:"
                                    verdi={'mangler'}
                                    navnIcon={<Notes width={20} height={20} />}
                                    verdiIcon={<ChevronRight width={20} height={20} />}
                                />
                            </>
                        ))}
                    </div>
                    <GenerellTilgangsInnhold />
                    <div className={cls.element('altinn-lenke')}>
                        <Lenke href="https://www.altinn.no/hjelp/profil/roller-og-rettigheter/">
                            Les mer om roller og rettigheter på altinn.no
                        </Lenke>
                    </div>
                </HvitBoks>
            );
        default:
            return (
                <HvitBoks className={cls.className}>
                    <Systemtittel className={cls.element('tittel')}>
                        Ikke tilgang til noen virksomheter i Altinn
                    </Systemtittel>
                    <GenerellTilgangsInnhold />
                </HvitBoks>
            );
    }
};
export default ManglerRettigheter;
