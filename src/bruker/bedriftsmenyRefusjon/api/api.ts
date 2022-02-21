import { initOrganisasjon, Juridiskenhet, ListeJuridiskeEnheter, Organisasjon } from './organisasjon';
import {
    finnJuridiskeEnheter,
    getJuridiskeEnheterFraBedrifter,
    getUnderEnheterFraBedrifter,
    getUnderenheterUtenJuridiskEnhet,
} from './api-Utils';

export async function byggOrganisasjonstre(organisasjoner: Organisasjon[]): Promise<Juridiskenhet[]> {
    const juridiskeEnheter = getJuridiskeEnheterFraBedrifter(organisasjoner);
    const underenheter = getUnderEnheterFraBedrifter(organisasjoner);
    const underenheterUtenJuridiskEnhet = getUnderenheterUtenJuridiskEnhet(underenheter, juridiskeEnheter);

    if (underenheterUtenJuridiskEnhet.length > 0) {
        await finnJuridiskeEnheter(underenheterUtenJuridiskEnhet).then((juridiskeEnheterUtenTilgang) => {
            juridiskeEnheter.push(...juridiskeEnheterUtenTilgang);
        });
    }

    return settSammenJuridiskEnhetMedUnderenheter(juridiskeEnheter, underenheter).sort((a, b) =>
        a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name)
    );
}

const settSammenJuridiskEnhetMedUnderenheter = (
    enheter: Organisasjon[],
    underenheter: Organisasjon[]
): Juridiskenhet[] => {
    return enheter
        .map((enhet) => {
            const tilhorendeUnderenheter = underenheter.filter(
                (underenhet) => underenhet.ParentOrganizationNumber === enhet.OrganizationNumber
            );
            return {
                JuridiskEnhet: enhet,
                Underenheter: tilhorendeUnderenheter,
                SokeresultatKunUnderenhet: false,
            };
        })
        .filter((orgtre) => orgtre.Underenheter.length > 0);
};

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgnr: string[],
    brregUrl: string
): Promise<Organisasjon[]> {
    listeMedJuridiskeOrgnr.forEach((orgnr) => {
        listeMedJuridiskeOrgnr.indexOf(orgnr) === 0 ? (brregUrl += orgnr) : (brregUrl += ',' + orgnr);
    });

    if (!window.location.href.includes('localhost')) {
        let respons = await fetch(brregUrl);
        if (respons.ok && listeMedJuridiskeOrgnr.length > 0) {
            const distinkteJuridiskeEnheterFraEreg: ListeJuridiskeEnheter = await respons.json();
            if (
                distinkteJuridiskeEnheterFraEreg._embedded &&
                distinkteJuridiskeEnheterFraEreg._embedded.enheter.length > 0
            ) {
                return distinkteJuridiskeEnheterFraEreg._embedded.enheter.map((orgFraEereg) => {
                    return {
                        ...initOrganisasjon,
                        Name: orgFraEereg.navn,
                        OrganizationNumber: orgFraEereg.organisasjonsnummer,
                        Type: 'Business',
                    };
                });
            }
        }
    } else {
        return lagListeMedMockedeJuridiskeEnheter(listeMedJuridiskeOrgnr);
    }
    return [];
}

function lagListeMedMockedeJuridiskeEnheter(listeMedJuridiskeOrgnr: string[]) {
    return listeMedJuridiskeOrgnr.map((orgNr) => {
        const jurOrg: Organisasjon = {
            ...initOrganisasjon,
            Name: 'MOCK ORGANISASJON',
            OrganizationNumber: orgNr,
            Type: 'Business',
        };
        return jurOrg;
    });
}
