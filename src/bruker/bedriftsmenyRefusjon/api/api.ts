import { Feilstatus, Juridiskenhet, ListeJuridiskeEnheter, Organisasjon, StatusFeil } from './organisasjon';
import {
    finnJuridiskeEnheter,
    getJuridiskeEnheterFraBedrifter,
    getUnderEnheterFraBedrifter,
    getUnderenheterUtenJuridiskEnhet,
} from './api-Utils';

interface ByggOrganisasjonstreProps {
    juridisk: Juridiskenhet[];
    feilstatus: StatusFeil | undefined;
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

const settSammenJuridiskEnhetMedUnderenheter = (
    enheter: Organisasjon[],
    underenheter: Organisasjon[]
): { JuridiskMedUnderenheter: Juridiskenhet[]; feilstatus: StatusFeil | undefined } => {
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
        JuridiskMedUnderenheter: juridiskenheter.filter((orgtre) => orgtre.Underenheter.length > 0),
        feilstatus: !!JuridiskUtenUnderenheter
            ? { status: Feilstatus.JURIDISK_MANGLER_UNDERENHET, gjeldeneOrg: JuridiskUtenUnderenheter }
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
