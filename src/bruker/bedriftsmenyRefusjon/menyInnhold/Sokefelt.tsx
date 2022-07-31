import React, { FunctionComponent, useContext, useState } from 'react';
import { Input } from 'nav-frontend-skjema';
import BEMHelper from '../../../utils/bem';
import { ClsBedriftsmeny, OrganisasjonEnhet, Organisasjonlist } from '../api/api';
import { MenyContext } from '../BedriftsmenyRefusjon';

const Sokefelt: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.MENYINNHOLD);
    const { organisasjonstre, setOrganisasjonstre, setSokefelt } = useContext(MenyContext);
    const [fultOrganisasjonstre, setFultOrganisasjonstre] = useState<Organisasjonlist | undefined>();

    const getSearchResult = (sokeOrd: string) => {
        if (sokeOrd.length >= 3) {
            if (!fultOrganisasjonstre) {
                setFultOrganisasjonstre(organisasjonstre);
            }
            const regex = new RegExp(sokeOrd, 'i');
            const sokeliste = fultOrganisasjonstre ?? organisasjonstre;
            const filter: OrganisasjonEnhet[] | undefined = sokeliste?.list.filter(
                (org) =>
                    org.Underenheter.some(
                        (enhet) => enhet.Name.search(regex) > -1 || enhet.OrganizationNumber.search(regex) > -1
                    ) ||
                    org.JuridiskEnhet.Name.search(regex) > -1 ||
                    org.JuridiskEnhet.OrganizationNumber.search(regex) > -1
            );
            setSokefelt({ aktivt: true, antallTreff: filter?.length ?? 0, organisasjonstreTreff: filter });
            setOrganisasjonstre(
                Object.assign({}, organisasjonstre, {
                    list: filter,
                    feilstatus: sokeliste?.feilstatus,
                })
            );
        } else {
            if (fultOrganisasjonstre) {
                setOrganisasjonstre(fultOrganisasjonstre);
                setSokefelt({ aktivt: false, antallTreff: 0, organisasjonstreTreff: undefined });
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
