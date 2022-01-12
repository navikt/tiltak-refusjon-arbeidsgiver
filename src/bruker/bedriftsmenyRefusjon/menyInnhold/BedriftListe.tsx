import React, { FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react';
import BEMHelper from '../../../utils/bem';
import { MenyContext } from '../BedriftsmenyRefusjon';
import { ReactComponent as JuridiskEnhet } from '@/asset/image/juridiskEnhet.svg';
import { ReactComponent as UnderEnhet } from '@/asset/image/underenhet.svg';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { NedChevron } from 'nav-frontend-chevron';
import './bedriftListe.less';
import Lenke from 'nav-frontend-lenker';
import { BedriftvalgType, Juridiskenhet, Organisasjon } from '../organisasjon';
import { Checkbox } from 'nav-frontend-skjema';

const BedriftListe: FunctionComponent<{}> = (props: PropsWithChildren<{}>) => {
    const cls = BEMHelper('bedriftliste');
    const context = useContext(MenyContext);
    const { organisasjonstre, bedriftvalg, setBedriftvalg } = context;
    const [apnetElement, setApnetElement] = useState<Array<{ index: number; apnet: boolean }> | undefined>(
        organisasjonstre?.map((e, index) => ({ index: index, apnet: false }))
    );

    const matchParentOrganisasjon = (org: Juridiskenhet) =>
        bedriftvalg.valgtOrg.find((e) => e.ParentOrganizationNumber === org.JuridiskEnhet.OrganizationNumber);

    const matchOrganisasjon = (org: Organisasjon) =>
        bedriftvalg.valgtOrg.find((e) => e.OrganizationNumber === org.OrganizationNumber);

    useEffect(() => {
        console.log('bedriftvalg: ', bedriftvalg);
    }, [bedriftvalg]);

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
                                }}
                            />
                            <Lenke
                                href="#nav.no"
                                className={cls.element('juridisk-lenke')}
                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    e.preventDefault();
                                    if (apnetElement) {
                                        setApnetElement(
                                            Object.assign([], apnetElement, {
                                                [index]: { index: index, apnet: !apnetElement[index].apnet },
                                            })
                                        );
                                    }
                                }}
                            >
                                <div className={cls.element('juridisk-wrapper')}>
                                    <div>
                                        <JuridiskEnhet />
                                    </div>
                                    <div className={cls.element('juridisk-info')}>
                                        <Element>{org.JuridiskEnhet?.Name ?? ''}</Element>
                                        <Normaltekst>org.nr. {org.JuridiskEnhet?.OrganizationNumber ?? ''}</Normaltekst>
                                        <Normaltekst>Vis 1 virksomhet</Normaltekst>
                                    </div>
                                    <div>
                                        <NedChevron />
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
                                            apnetElement && apnetElement[index].apnet ? 'open' : ''
                                        )}
                                        key={underenhetIndex}
                                    >
                                        <div className={cls.element('underenhet-container')}>
                                            <div className={cls.element('underenhet-checkbox')}>
                                                <Checkbox
                                                    label={''}
                                                    checked={
                                                        !!bedriftvalg.valgtOrg.find(
                                                            (e) =>
                                                                e.OrganizationNumber === underenhet.OrganizationNumber
                                                        )
                                                    }
                                                    onChange={() => {
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
                                                    }}
                                                />
                                            </div>
                                            <Lenke
                                                className={cls.element('underenhet-lenke')}
                                                href="#nav.no"
                                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                                    e.preventDefault();
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
