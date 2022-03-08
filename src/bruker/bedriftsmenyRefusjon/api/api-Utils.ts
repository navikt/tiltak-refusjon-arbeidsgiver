import { BedriftListe, Juridiskenhet, Organisasjon } from './organisasjon';
import { hentAlleJuridiskeEnheter } from './api';
import { Dispatch, SetStateAction } from 'react';

const BRREG_URL: string = 'https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=';

export const erGyldigUnderenhet = (key: string): boolean => ['BEDR', 'AAFY'].includes(key);

export function getJuridiskeEnheterFraBedrifter(organisasjoner: Organisasjon[]): Organisasjon[] {
    return organisasjoner.filter(
        (organisasjon: Organisasjon) => organisasjon.Type === 'Enterprise' || organisasjon.OrganizationForm === 'FLI'
    );
}

export function getUnderEnheterFraBedrifter(organisasjoner: Organisasjon[]): Organisasjon[] {
    return organisasjoner.filter(
        (organisasjon) => erGyldigUnderenhet(organisasjon.OrganizationForm) && organisasjon.OrganizationNumber
    );
}

export function getUnderenheterUtenJuridiskEnhet(
    underenheter: Organisasjon[],
    juridiskeEnheter: Organisasjon[]
): Organisasjon[] {
    return underenheter.filter(
        (underenhet) => !juridiskeEnheter.find((o) => o.OrganizationNumber === underenhet.ParentOrganizationNumber)
    );
}

function hentUnikListeMedJuridiskenhetsNr(underenheterUtenJuridiskEnhet: Organisasjon[]): string {
    const listeMedJuridiskenhetsNr = underenheterUtenJuridiskEnhet
        .filter((org, index) => org.ParentOrganizationNumber && underenheterUtenJuridiskEnhet.indexOf(org) === index)
        .map((org) => org.ParentOrganizationNumber);
    return listeMedJuridiskenhetsNr
        .filter((orgnr, index) => listeMedJuridiskenhetsNr.indexOf(orgnr) === index)
        .join(',');
}

export async function finnJuridiskeEnheter(underenheterUtenJuridiskEnhet: Organisasjon[]): Promise<Organisasjon[]> {
    return await hentAlleJuridiskeEnheter(hentUnikListeMedJuridiskenhetsNr(underenheterUtenJuridiskEnhet), BRREG_URL);
}

export function setDefaultBedriftlisteMedApneElementer(
    orgtre: Juridiskenhet[] | undefined,
    setBedriftListe: Dispatch<SetStateAction<BedriftListe>>
): void {
    setBedriftListe(orgtre?.map((o, i) => ({ index: i, apnet: false })));
}
