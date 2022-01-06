import { Organisasjon } from '../organisasjon';
import { hentAlleJuridiskeEnheter } from './api';

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

export function getUnderenheterUtenJuridiskEnhet(underenheter: Organisasjon[], juridiskeEnheter: Organisasjon[]) {
    return underenheter.filter(
        (underenhet) => !juridiskeEnheter.find((o) => o.OrganizationNumber === underenhet.ParentOrganizationNumber)
    );
}

function hentUnikListeMedJuridiskenhetsNr(underenheterUtenJuridiskEnhet: Organisasjon[]) {
    return underenheterUtenJuridiskEnhet
        .filter((org, index) => org.ParentOrganizationNumber && underenheterUtenJuridiskEnhet.indexOf(org) === index)
        .map((org) => org.ParentOrganizationNumber);
}

export async function finnJuridiskeEnheter(underenheterUtenJuridiskEnhet: Organisasjon[]) {
    return await hentAlleJuridiskeEnheter(hentUnikListeMedJuridiskenhetsNr(underenheterUtenJuridiskEnhet), BRREG_URL);
}
