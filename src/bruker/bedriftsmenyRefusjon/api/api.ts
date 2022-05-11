import { Feilstatus, Juridiskenhet, ListeJuridiskeEnheter, Organisasjon, StatusFeil } from './organisasjon';
import {
    finnJuridiskeEnheter,
    getJuridiskeEnheterFraBedrifter,
    getUnderEnheterFraBedrifter,
    getUnderenheterUtenJuridiskEnhet,
} from './api-Utils';

export interface ByggOrganisasjonstre {
    juridisk: Array<Juridiskenhet>;
    feilstatus: Array<StatusFeil> | undefined;
}

export async function byggOrganisasjonstre(organisasjoner: Organisasjon[]): Promise<ByggOrganisasjonstre> {
    const juridiskeEnheter = getJuridiskeEnheterFraBedrifter(organisasjoner);
    const underenheter = getUnderEnheterFraBedrifter(organisasjoner);
    const underenheterUtenJuridiskEnhet = getUnderenheterUtenJuridiskEnhet(underenheter, juridiskeEnheter);

    if (underenheterUtenJuridiskEnhet.length > 0) {
        await finnJuridiskeEnheter(underenheterUtenJuridiskEnhet).then((juridiskeEnheterUtenTilgang) => {
            juridiskeEnheter.push(...juridiskeEnheterUtenTilgang);
        });
    }
    const bedriftliste = settSammenJuridiskEnhetMedUnderenheter(juridiskeEnheter, underenheter);

    return {
        juridisk: bedriftliste.juridisk.sort((a, b) => a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name)),
        feilstatus: bedriftliste.feilstatus,
    };
}

const finJuridiskUtenUnderenheter = (juridiskenheter: Juridiskenhet[]) =>
    juridiskenheter.filter((juridiskenhet) => juridiskenhet.Underenheter?.length === 0).map((o) => o.JuridiskEnhet);

function oppdatertFeilstatus(juridiskenheter: Juridiskenhet[]) {
    let feilstatus: Array<StatusFeil> | undefined = [];
    const JuridiskUtenUnderenheter: Organisasjon[] = finJuridiskUtenUnderenheter(juridiskenheter);

    if (JuridiskUtenUnderenheter?.length > 0) {
        feilstatus?.push({ status: Feilstatus.JURIDISK_MANGLER_UNDERENHET, gjeldeneOrg: JuridiskUtenUnderenheter });
    }
    if (!juridiskenheter || juridiskenheter?.length === 0) {
        feilstatus?.push({ status: Feilstatus.GREIDE_IKKE_BYGGE_ORGTRE, gjeldeneOrg: undefined });
    }
    return feilstatus;
}

const settSammenJuridiskEnhetMedUnderenheter = (
    enheter: Organisasjon[],
    underenheter: Organisasjon[]
): ByggOrganisasjonstre => {
    const juridiskenheter: Juridiskenhet[] = enheter.map((enhet) => ({
        JuridiskEnhet: enhet,
        Underenheter: underenheter.filter(
            (underenhet) => underenhet.ParentOrganizationNumber === enhet.OrganizationNumber
        ),
        SokeresultatKunUnderenhet: false,
    }));
    return {
        juridisk: juridiskenheter.filter((orgtre) => orgtre.Underenheter.length > 0),
        feilstatus: oppdatertFeilstatus(juridiskenheter),
    };
};

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgnr: string,
    brregUrl: string
): Promise<Organisasjon[]> {
    try {
        const respons = await fetch(brregUrl + listeMedJuridiskeOrgnr);
        if (respons.ok && listeMedJuridiskeOrgnr.length > 0) {
            const distinkteJuridiskeEnheterFraEreg: ListeJuridiskeEnheter = await respons.json();
            if (
                distinkteJuridiskeEnheterFraEreg._embedded &&
                distinkteJuridiskeEnheterFraEreg._embedded.enheter.length > 0
            ) {
                return distinkteJuridiskeEnheterFraEreg._embedded.enheter.map((orgFraEereg) => {
                    return {
                        Name: orgFraEereg.navn,
                        Type: 'Enterprise',
                        OrganizationNumber: orgFraEereg.organisasjonsnummer,
                        OrganizationForm: orgFraEereg.organisasjonsform?.kode ?? 'AS',
                        Status: 'Active',
                        ParentOrganizationNumber: '',
                    };
                });
            }
        }
    } catch (e) {
        console.warn('kall til brreg.no feilet: ', e);
    }
    return lagBackupListeMedJuridiskeEnheter(listeMedJuridiskeOrgnr.split(','));
}

function lagBackupListeMedJuridiskeEnheter(listeMedJuridiskeOrgnr: string[]) {
    return listeMedJuridiskeOrgnr.map((orgnr) => {
        return {
            Name: `${orgnr} (Juridisk enhet) `,
            Type: 'Enterprise',
            OrganizationNumber: orgnr,
            OrganizationForm: 'AS',
            Status: 'Active',
            ParentOrganizationNumber: '',
        };
    });
}
