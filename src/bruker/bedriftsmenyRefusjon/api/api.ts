import { Feilstatus, initOrganisasjon, Juridiskenhet, ListeJuridiskeEnheter, Organisasjon } from './organisasjon';
import {
    finnJuridiskeEnheter,
    getJuridiskeEnheterFraBedrifter,
    getUnderEnheterFraBedrifter,
    getUnderenheterUtenJuridiskEnhet,
} from './api-Utils';

interface ByggOrganisasjonstreProps {
    juridisk: Juridiskenhet[];
    feilstatus: Feilstatus | undefined;
}

export async function byggOrganisasjonstre(organisasjoner: Organisasjon[]): Promise<ByggOrganisasjonstreProps> {
    const juridiskeEnheter = getJuridiskeEnheterFraBedrifter(organisasjoner);
    const underenheter = getUnderEnheterFraBedrifter(organisasjoner);
    const underenheterUtenJuridiskEnhet = getUnderenheterUtenJuridiskEnhet(underenheter, juridiskeEnheter);

    if (underenheterUtenJuridiskEnhet.length > 0) {
        await finnJuridiskeEnheter(underenheterUtenJuridiskEnhet).then((juridiskeEnheterUtenTilgang) => {
            juridiskeEnheter.push(...juridiskeEnheterUtenTilgang);
        });
    }

    const juridiskMedUnderenheter = settSammenJuridiskEnhetMedUnderenheter(juridiskeEnheter, underenheter);
    return {
        juridisk: juridiskMedUnderenheter.JuridiskMedUnderenheter.sort((a, b) =>
            a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name)
        ),
        feilstatus: juridiskMedUnderenheter.feilstatus,
    };
}

/**
 *      Juridiks enhet uten underenheter
 *      Underenhet som ikke greier kobles mot juridisk
 *      mangler tilganger på refusjon
 *
 * */

const settSammenJuridiskEnhetMedUnderenheter = (
    enheter: Organisasjon[],
    underenheter: Organisasjon[]
): { JuridiskMedUnderenheter: Juridiskenhet[]; feilstatus: Feilstatus | undefined } => {
    const juridiskenheter = enheter.map((enhet) => {
        const tilhorendeUnderenheter = underenheter.filter(
            (underenhet) => underenhet.ParentOrganizationNumber === enhet.OrganizationNumber
        );
        return {
            JuridiskEnhet: enhet,
            Underenheter: tilhorendeUnderenheter,
            SokeresultatKunUnderenhet: false,
        };
    });

    return {
        JuridiskMedUnderenheter: juridiskenheter.filter((orgtre) => orgtre.Underenheter.length > 0),
        feilstatus: juridiskenheter.some((juridiskenhet) => juridiskenhet.Underenheter.length === 0)
            ? Feilstatus.JURIDISK_MANGLER_UNDERENHET
            : undefined,
    };
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
