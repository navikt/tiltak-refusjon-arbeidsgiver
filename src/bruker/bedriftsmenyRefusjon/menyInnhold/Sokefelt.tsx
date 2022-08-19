import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Input } from 'nav-frontend-skjema';
import BEMHelper from '../../../utils/bem';
import { ClsBedriftsmeny, OrganisasjonEnhet } from '../api/api';
import { MenyContext } from '../BedriftsmenyRefusjon';

const Sokefelt: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.MENYINNHOLD);
    const { organisasjonstre, setOrganisasjonstre, setSokefelt, sokefelt } = useContext(MenyContext);
    const [inputfelt, setInputfelt] = useState<string>('');

    useEffect(() => {
        if (!sokefelt.aktivt && inputfelt) {
            setInputfelt('');
        }
    }, [sokefelt, inputfelt]);

    const getSearchResult = (sokeOrd: string) => {
        setInputfelt(sokeOrd);
        if (sokeOrd.length >= 0) {
            const regex = new RegExp(sokeOrd, 'i');
            const sokeliste = sokefelt.fultOrganisasjonstre ?? organisasjonstre;
            const resultat = sokeliste?.list?.filter(
                (org) =>
                    org.Underenheter.some(
                        (enhet) => enhet.Name.search(regex) > -1 || enhet.OrganizationNumber.search(regex) > -1
                    ) ||
                    org.JuridiskEnhet.Name.search(regex) > -1 ||
                    org.JuridiskEnhet.OrganizationNumber.search(regex) > -1
            ) as OrganisasjonEnhet[] | [];
            setSokefelt({
                aktivt: true,
                sokeord: sokeOrd,
                antallTreff: resultat?.length ?? 0,
                organisasjonstreTreff: resultat,
                fultOrganisasjonstre: sokeliste,
            });
            setOrganisasjonstre({ list: resultat, feilstatus: undefined });
        } else {
            if (sokefelt.fultOrganisasjonstre) {
                setOrganisasjonstre(sokefelt.fultOrganisasjonstre);
                setSokefelt({
                    aktivt: false,
                    sokeord: sokeOrd,
                    antallTreff: 0,
                    organisasjonstreTreff: undefined,
                    fultOrganisasjonstre: undefined,
                });
            }
        }
    };

    return (
        <Input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                getSearchResult(event.target.value);
            }}
            value={inputfelt}
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
