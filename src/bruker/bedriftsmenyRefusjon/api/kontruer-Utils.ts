import { BedriftListe, OrganisasjonEnhet, Organisasjon } from './api';
import { hentAlleJuridiskeEnheter } from './konstruer';
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

function hentUnikListeMedJuridiskenhetsNr(underenheterUtenJuridiskEnhet: Organisasjon[]): {
    org: Organisasjon[];
    nr: string;
} {
    const listeMedJuridiskenhetsOrg = underenheterUtenJuridiskEnhet.filter(
        (org, index) => org.ParentOrganizationNumber && underenheterUtenJuridiskEnhet.indexOf(org) === index
    );
    const listeMedJuridiskenhetsNr = listeMedJuridiskenhetsOrg.map((org) => org.ParentOrganizationNumber).join(',');
    return { org: listeMedJuridiskenhetsOrg, nr: listeMedJuridiskenhetsNr };
}

export async function finnJuridiskeEnheter(
    underenheterUtenJuridiskEnhet: Organisasjon[]
): Promise<{ org: Organisasjon[]; manglerJuridisk: Organisasjon[] }> {
    return await hentAlleJuridiskeEnheter(hentUnikListeMedJuridiskenhetsNr(underenheterUtenJuridiskEnhet), BRREG_URL);
}

export function setDefaultBedriftlisteMedApneLabeler(
    orgtre: OrganisasjonEnhet[] | undefined,
    setBedriftListe: Dispatch<SetStateAction<BedriftListe>>
): void {
    setBedriftListe(orgtre?.map((o, i) => ({ index: i, apnet: false })));
}
