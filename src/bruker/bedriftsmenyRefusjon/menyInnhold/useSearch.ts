import { Juridiskenhet, Sokefelt } from '../api/organisasjon';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { MenyContext } from '../BedriftsmenyRefusjon';

interface Props {
    sokeOrd: string;
    organisasjonstre: Juridiskenhet[] | undefined;
    setOrganisasjonstre: Dispatch<SetStateAction<Juridiskenhet[] | undefined>>;
    setSokefelt: Dispatch<SetStateAction<Sokefelt>>;
    fultOrganisasjonstre: Juridiskenhet[] | undefined;
    setFultOrganisasjonstre: Dispatch<SetStateAction<Juridiskenhet[] | undefined>>;
}

export const useSearch = (sokeOrd: string) => {
    const { organisasjonstre, setOrganisasjonstre, setSokefelt } = useContext(MenyContext);
    const [fultOrganisasjonstre, setFultOrganisasjonstre] = useState<Juridiskenhet[] | undefined>();
    if (sokeOrd.length >= 3) {
        if (!fultOrganisasjonstre) {
            setFultOrganisasjonstre(organisasjonstre);
        }
        const regex = new RegExp(sokeOrd, 'i');
        const sokeliste = fultOrganisasjonstre ?? organisasjonstre;
        const filter: Juridiskenhet[] | undefined = sokeliste?.filter(
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
    }
};
