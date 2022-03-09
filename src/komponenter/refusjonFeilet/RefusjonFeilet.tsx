import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import HvitBoks from '../hvitboks/HvitBoks';
import { Normaltekst, Systemtittel, Undertittel, Element } from 'nav-frontend-typografi';
import { Feilstatus, Organisasjon, StatusFeil } from '../../bruker/bedriftsmenyRefusjon/api/organisasjon';
import { ReactComponent as SystemError } from '@/asset/image/systemError.svg';
import { ReactComponent as ChevronRight } from '@/asset/image/chevronRight.svg';
import { ReactComponent as JuridiskEnhet } from '@/asset/image/juridiskEnhet2.svg';
import { ReactComponent as Notes } from '@/asset/image/notes.svg';
import BEMHelper from '../../utils/bem';
import './refusjonFeilet.less';
import Lenke from 'nav-frontend-lenker';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';

interface Props {
    feilstatus: StatusFeil | undefined;
}

interface LagNyRadProps {
    navn: string;
    verdi: string;
    navnIcon?: React.ReactNode;
    verdiIcon?: React.ReactNode;
}

const RefusjonFeilet: FunctionComponent<Props> = ({ feilstatus }: PropsWithChildren<Props>) => {
    const cls = BEMHelper('refusjonFeilet');
    const [panel, setPanel] = useState<Array<{ index: number; apnet: boolean }> | undefined>(
        feilstatus?.gjeldeneOrg?.map((_, i) => ({ index: i, apnet: false }))
    );

    useEffect(() => {
        setPanel(feilstatus?.gjeldeneOrg?.map((_, i) => ({ index: i, apnet: false })));
    }, [feilstatus?.gjeldeneOrg]);

    const LagNyRad: FunctionComponent<LagNyRadProps> = ({ navn, verdi, navnIcon, verdiIcon }: LagNyRadProps) => (
        <div className={cls.element('rad')}>
            <div>
                <span>{navnIcon}</span>
                <Element>{navn}</Element>
            </div>
            <div>
                <span className={cls.element('verdi-icon')}>{verdiIcon}</span>
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

    switch (feilstatus?.status) {
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
                        {feilstatus?.gjeldeneOrg?.map((org: Organisasjon, index: number) => {
                            return (
                                <EkspanderbartpanelBase
                                    className={cls.element('panel')}
                                    tittel={<Element>{org.Name ?? ''}</Element>}
                                    apen={panel?.[index].apnet}
                                    onClick={() => {
                                        if (panel) {
                                            setPanel(
                                                Object.assign([], panel, {
                                                    [index]: { index: index, apnet: !panel[index].apnet },
                                                })
                                            );
                                        }
                                    }}
                                    key={index}
                                >
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
                                </EkspanderbartpanelBase>
                            );
                        })}
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
export default RefusjonFeilet;
