import React, { FunctionComponent, useContext, useState } from 'react';
import { Input } from 'nav-frontend-skjema';
import BEMHelper from '../../../utils/bem';
import { ClsBedriftsmeny, Juridiskenhet } from '../api/organisasjon';
import { MenyContext } from '../BedriftsmenyRefusjon';

const Sokefelt: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.MENYINNHOLD);
    const { organisasjonstre, setOrganisasjonstre } = useContext(MenyContext);
    const [fultOrganisasjonstre, setFultOrganisasjonstre] = useState<Juridiskenhet[] | undefined>();

    const getSearchResult = (findMe: string) => {
        if (findMe.length >= 3) {
            if (!fultOrganisasjonstre) {
                setFultOrganisasjonstre(organisasjonstre);
            }
            const regex = new RegExp(findMe, 'i');
            const filter = organisasjonstre?.filter(
                (org) =>
                    org.Underenheter.some(
                        (enhet) => enhet.Name.search(regex) > -1 || enhet.OrganizationNumber.search(regex) > -1
                    ) ||
                    org.JuridiskEnhet.Name.search(regex) > -1 ||
                    org.JuridiskEnhet.OrganizationNumber.search(regex) > -1
            );
            setOrganisasjonstre(filter);
        } else {
            if (fultOrganisasjonstre) {
                setOrganisasjonstre(fultOrganisasjonstre);
                setFultOrganisasjonstre(undefined);
            }
        }
    };
    return (
        <Input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                getSearchResult(event.target.value);
            }}
            className={cls.element('sokefelt')}
            aria-label="Søk etter bedrift"
            type="search"
            placeholder="orgnr eller navn"
            size={35}
            label="Søk etter bedrift"
        />
    );
};
export default Sokefelt;
