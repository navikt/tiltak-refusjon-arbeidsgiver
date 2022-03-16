import { Feilstatus, Juridiskenhet, ListeJuridiskeEnheter, Organisasjon, StatusFeil } from './organisasjon';
import {
    finnJuridiskeEnheter,
    getJuridiskeEnheterFraBedrifter,
    getUnderEnheterFraBedrifter,
    getUnderenheterUtenJuridiskEnhet,
} from './api-Utils';

interface ByggOrganisasjonstreProps {
    juridisk: Juridiskenhet[];
    feilstatus: Array<StatusFeil> | undefined;
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

    const bedriftliste = settSammenJuridiskEnhetMedUnderenheter(juridiskeEnheter, underenheter);

    return {
        juridisk: bedriftliste.juridisk.sort((a, b) => a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name)),
        feilstatus: OppdatertFeilstatus(bedriftliste),
    };
}

function OppdatertFeilstatus(bedriftliste: ByggOrganisasjonstreProps): Array<StatusFeil> | undefined {
    if (bedriftliste?.juridisk?.length === 0) {
        bedriftliste.feilstatus?.push({
            status: Feilstatus.GREIDE_IKKE_BYGGE_ORGTRE,
            gjeldeneOrg: undefined,
        });
    }
    return bedriftliste.feilstatus;
}

const settSammenJuridiskEnhetMedUnderenheter = (
    enheter: Organisasjon[],
    underenheter: Organisasjon[]
): ByggOrganisasjonstreProps => {
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

    const JuridiskUtenUnderenheter = juridiskenheter
        .filter((juridiskenhet) => juridiskenhet.Underenheter?.length === 0)
        .map((o) => o.JuridiskEnhet);

    return {
        juridisk: juridiskenheter.filter((orgtre) => orgtre.Underenheter.length > 0),
        feilstatus: !!JuridiskUtenUnderenheter
            ? [{ status: Feilstatus.JURIDISK_MANGLER_UNDERENHET, gjeldeneOrg: JuridiskUtenUnderenheter }]
            : undefined,
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
