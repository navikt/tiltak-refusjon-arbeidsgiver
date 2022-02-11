import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { MenyContext } from '../../BedriftsmenyRefusjon';
import { ReactComponent as JuridiskEnhet } from '@/asset/image/juridiskEnhet2.svg';
import { ReactComponent as UnderEnhet } from '@/asset/image/childNode.svg';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { NedChevron } from 'nav-frontend-chevron';
import './bedriftListe.less';
import Lenke from 'nav-frontend-lenker';
import { BedriftvalgType, Juridiskenhet, Organisasjon } from '../../api/organisasjon';
import { Checkbox } from 'nav-frontend-skjema';
import BEMHelper from '../../../../utils/bem';
import { setDefaultBedriftlisteMedApneElementer } from '../../api/api-Utils';

const BedriftListe: FunctionComponent<{}> = (props: PropsWithChildren<{}>) => {
    const cls = BEMHelper('bedriftliste');
    const context = useContext(MenyContext);
    const {
        bedriftvalg,
        setBedriftvalg,
        setValgtBedrift,
        bedriftListe,
        setBedriftListe,
        setMenyApen,
        organisasjonstre,
    } = context;

    const matchParentOrganisasjon = (org: Juridiskenhet) =>
        bedriftvalg.valgtOrg.find((e) => e.ParentOrganizationNumber === org.JuridiskEnhet.OrganizationNumber);

    const matchOrganisasjon = (org: Organisasjon) =>
        bedriftvalg.valgtOrg.find((e) => e.OrganizationNumber === org.OrganizationNumber);

    return (
        <div className={cls.className}>
            <ul className={cls.element('organisasjonlist')}>
                {context.organisasjonstre?.map((org: Juridiskenhet, index: number) => (
                    <li className={cls.element('juridisk-container')} key={index}>
                        <div
                            className={cls.element(
                                'juridiskenhet',
                                bedriftvalg.type === BedriftvalgType.ENKELBEDRIFT ? 'skjule' : ''
                            )}
                        >
                            <Checkbox
                                label={''}
                                className={cls.element('checkbox')}
                                checked={!!matchParentOrganisasjon(org)}
                                onChange={() => {
                                    if (bedriftvalg.type !== BedriftvalgType.ALLEBEDRIFTER) {
                                        const element = matchParentOrganisasjon(org);
                                        if (!!element) {
                                            return setBedriftvalg({
                                                type: bedriftvalg.type,
                                                valgtOrg: bedriftvalg.valgtOrg.filter((e) => e !== element),
                                            });
                                        }
                                        setBedriftvalg({
                                            ...bedriftvalg,
                                            valgtOrg: [...bedriftvalg.valgtOrg, ...org.Underenheter],
                                        });
                                    }
                                }}
                            />
                            <Lenke
                                href="#nav.no"
                                className={cls.element('juridisk-lenke')}
                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    e.preventDefault();
                                    if (bedriftListe) {
                                        setBedriftListe(
                                            Object.assign([], bedriftListe, {
                                                [index]: { index: index, apnet: !bedriftListe[index].apnet },
                                            })
                                        );
                                    }
                                }}
                            >
                                <div className={cls.element('juridisk-wrapper')}>
                                    <div className={cls.element('icon-container')}>
                                        <JuridiskEnhet />
                                    </div>
                                    <div className={cls.element('juridisk-info')}>
                                        <Element>{org.JuridiskEnhet?.Name ?? ''}</Element>
                                        <Normaltekst>org.nr. {org.JuridiskEnhet?.OrganizationNumber ?? ''}</Normaltekst>
                                        <Normaltekst>Vis 1 virksomhet</Normaltekst>
                                    </div>
                                    <div>
                                        <NedChevron
                                            className={cls.element(
                                                'juridiskenhet-chevron',
                                                bedriftListe && bedriftListe[index].apnet ? 'open' : ''
                                            )}
                                        />
                                    </div>
                                </div>
                            </Lenke>
                        </div>
                        <ul className={cls.element('underenhet-list')}>
                            {org.Underenheter.map((underenhet: Organisasjon, underenhetIndex: number) => {
                                return (
                                    <li
                                        className={cls.element(
                                            'underenhet',
                                            bedriftListe && bedriftListe[index].apnet ? 'open' : ''
                                        )}
                                        key={underenhetIndex}
                                    >
                                        <div className={cls.element('underenhet-container')}>
                                            <div
                                                className={cls.element(
                                                    'underenhet-checkbox',
                                                    bedriftvalg.type === BedriftvalgType.ENKELBEDRIFT ? 'skjule' : ''
                                                )}
                                            >
                                                <Checkbox
                                                    label={''}
                                                    checked={
                                                        !!bedriftvalg.valgtOrg.find(
                                                            (e) =>
                                                                e.OrganizationNumber === underenhet.OrganizationNumber
                                                        )
                                                    }
                                                    onChange={() => {
                                                        if (bedriftvalg.type !== BedriftvalgType.ALLEBEDRIFTER) {
                                                            const element = matchOrganisasjon(underenhet);
                                                            if (!!element) {
                                                                return setBedriftvalg({
                                                                    type: bedriftvalg.type,
                                                                    valgtOrg: bedriftvalg.valgtOrg.filter(
                                                                        (e) => e !== element
                                                                    ),
                                                                });
                                                            }
                                                            setBedriftvalg({
                                                                ...bedriftvalg,
                                                                valgtOrg: [...bedriftvalg.valgtOrg, underenhet],
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <Lenke
                                                className={cls.element('underenhet-lenke')}
                                                href="#nav.no"
                                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                                    e.preventDefault();
                                                    if (bedriftvalg.type === BedriftvalgType.ENKELBEDRIFT) {
                                                        setBedriftvalg({
                                                            type: BedriftvalgType.ENKELBEDRIFT,
                                                            valgtOrg: [underenhet],
                                                        });
                                                        setValgtBedrift({
                                                            type: BedriftvalgType.ENKELBEDRIFT,
                                                            valgtOrg: [underenhet],
                                                        });
                                                        setMenyApen(false);
                                                        setDefaultBedriftlisteMedApneElementer(
                                                            organisasjonstre,
                                                            setBedriftListe
                                                        );
                                                    }
                                                }}
                                            >
                                                <div className={cls.element('underenhet-ikon')}>
                                                    <UnderEnhet />
                                                </div>
                                                <div>
                                                    <Element>{underenhet?.Name ?? ''}</Element>
                                                    <Normaltekst>
                                                        virksomhetsnr. {underenhet?.OrganizationNumber ?? ''}
                                                    </Normaltekst>
                                                </div>
                                            </Lenke>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default BedriftListe;
