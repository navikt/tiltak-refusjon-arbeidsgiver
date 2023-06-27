import React, { FunctionComponent, PropsWithChildren } from 'react';
import HvitBoks from '../hvitboks/HvitBoks';
import { ReactComponent as Notes } from '@/asset/image/notes.svg';
import { ReactComponent as ChevronRight } from '@/asset/image/chevronRight.svg';
import { ReactComponent as JuridiskEnhet } from '@/asset/image/juridiskEnhet2.svg';
import { ReactComponent as SystemError } from '@/asset/image/systemError.svg';
import { Bedriftvalg, Feilstatus, Organisasjon } from '../../bruker/bedriftsmenyRefusjon/api/api';
import LagNyRad from './LagNyRad';
import BEMHelper from '../../utils/bem';
import { ExpansionCard, Link, Heading } from '@navikt/ds-react';

interface Props {
    bedriftvalg: Bedriftvalg;
}

const RefusjonFeiletManglerUnderEnhet: FunctionComponent<Props> = ({ bedriftvalg }: PropsWithChildren<Props>) => {
    const cls = BEMHelper('refusjonFeilet');
    const orgMedFeilstatusJuridiskEnhetMangler: Organisasjon[] | undefined = bedriftvalg?.feilstatus
        ?.find((feil) => feil.status === Feilstatus.JURIDISK_MANGLER_UNDERENHET)
        ?.gjeldeneOrg?.map((feil) => feil);

    return (
        <HvitBoks className={cls.className}>
            <div className={cls.element('mangler-underenhet-wrapper')}>
                <div className={cls.element('header')}>
                    <Heading size="small">
                        Du har tilganger til en eller flere bedrifter, men kun på juridisk nivå.
                    </Heading>
                    <div className={cls.element('ikon')}>
                        <SystemError width={24} height={24} />
                    </div>
                </div>
                {orgMedFeilstatusJuridiskEnhetMangler?.map((org: Organisasjon, index: number) => {
                    return (
                        <ExpansionCard size="small" aria-label="Small-variant" defaultOpen={true}>
                            <ExpansionCard.Header>
                                <ExpansionCard.Title size="small">{org.Name ?? ''}</ExpansionCard.Title>
                            </ExpansionCard.Header>
                            <ExpansionCard.Content>
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
                            </ExpansionCard.Content>
                        </ExpansionCard>
                    );
                })}
            </div>

            <div className={cls.element('altinn-lenke')}>
                <Link href="https://www.altinn.no/hjelp/profil/roller-og-rettigheter/">
                    Les mer om roller og rettigheter på altinn.no
                </Link>
            </div>
        </HvitBoks>
    );
};
export default RefusjonFeiletManglerUnderEnhet;
