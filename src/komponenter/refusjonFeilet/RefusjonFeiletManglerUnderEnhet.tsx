import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import HvitBoks from '../hvitboks/HvitBoks';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { ReactComponent as Notes } from '@/asset/image/notes.svg';
import { ReactComponent as ChevronRight } from '@/asset/image/chevronRight.svg';
import { ReactComponent as JuridiskEnhet } from '@/asset/image/juridiskEnhet2.svg';
import { ReactComponent as SystemError } from '@/asset/image/systemError.svg';
import { Bedriftvalg, Feilstatus, Organisasjon } from '../../bruker/bedriftsmenyRefusjon/api/api';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';
import LagNyRad from './LagNyRad';
import BEMHelper from '../../utils/bem';

interface Props {
    bedriftvalg: Bedriftvalg;
}

const RefusjonFeiletManglerUnderEnhet: FunctionComponent<Props> = ({ bedriftvalg }: PropsWithChildren<Props>) => {
    const cls = BEMHelper('refusjonFeilet');
    const orgMedFeilstatusJuridiskEnhetMangler: Organisasjon[] | undefined = bedriftvalg?.feilstatus
        ?.find((feil) => feil.status === Feilstatus.JURIDISK_MANGLER_UNDERENHET)
        ?.gjeldeneOrg?.map((feil) => feil);
    const [panel, setPanel] = useState<Array<{ index: number; apnet: boolean }> | undefined>(
        orgMedFeilstatusJuridiskEnhetMangler?.map((_, i) => ({ index: i, apnet: false }))
    );

    useEffect(() => {
        setPanel(orgMedFeilstatusJuridiskEnhetMangler?.map((_, i) => ({ index: i, apnet: false })));
    }, [orgMedFeilstatusJuridiskEnhetMangler]);

    return (
        <HvitBoks className={cls.className}>
            <div className={cls.element('mangler-underenhet-wrapper')}>
                <div className={cls.element('header')}>
                    <Undertittel>Du har tilganger til en eller flere bedrifter, men kun på juridisk nivå.</Undertittel>
                    <div className={cls.element('ikon')}>
                        <SystemError width={24} height={24} />
                    </div>
                </div>
                {orgMedFeilstatusJuridiskEnhetMangler?.map((org: Organisasjon, index: number) => {
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

            <div className={cls.element('altinn-lenke')}>
                <Lenke href="https://www.altinn.no/hjelp/profil/roller-og-rettigheter/">
                    Les mer om roller og rettigheter på altinn.no
                </Lenke>
            </div>
        </HvitBoks>
    );
};
export default RefusjonFeiletManglerUnderEnhet;
