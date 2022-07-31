/*
import { OrganisasjonEnhet, Sokefelt } from '../api/api';
import { Dispatch, SetStateAction } from 'react';
*/

/*interface Props {
    sokeOrd: string;
    organisasjonstre: OrganisasjonEnhet[] | undefined;
    setOrganisasjonstre: Dispatch<SetStateAction<OrganisasjonEnhet[] | undefined>>;
    setSokefelt: Dispatch<SetStateAction<Sokefelt>>;
    fultOrganisasjonstre: OrganisasjonEnhet[] | undefined;
    setFultOrganisasjonstre: Dispatch<SetStateAction<OrganisasjonEnhet[] | undefined>>;
}*/

export const useSearch = (sokeOrd: string) => {
    /* const { organisasjonstre, setOrganisasjonstre, setSokefelt } = useContext(MenyContext);
    const [fultOrganisasjonstre, setFultOrganisasjonstre] = useState<OrganisasjonEnhet[] | undefined>();
    if (sokeOrd.length >= 3) {
        if (!fultOrganisasjonstre) {
            setFultOrganisasjonstre(organisasjonstre);
        }
        const regex = new RegExp(sokeOrd, 'i');
        const sokeliste = fultOrganisasjonstre ?? organisasjonstre;
        const filter: OrganisasjonEnhet[] | undefined = sokeliste?.filter(
            (org) =>
                org.Underenheter.some(
                    (enhet) => enhet.Name.search(regex) > -1 || enhet.OrganizationNumber.search(regex) > -1
                ) ||
                org.JuridiskEnhet.Name.search(regex) > -1 ||
                org.JuridiskEnhet.OrganizationNumber.search(regex) > -1
        );
        setSokefelt({ aktivt: true, antallTreff: filter?.length ?? 0, organisasjonstreTreff: filter });
        setOrganisasjonstre(filter);
    } else {
        if (fultOrganisasjonstre) {
            setOrganisasjonstre(fultOrganisasjonstre);
            setSokefelt({ aktivt: false, antallTreff: 0, organisasjonstreTreff: undefined });
            setFultOrganisasjonstre(undefined);
        }
    }*/
};
