import {
    FeilNivå,
    Feilstatus,
    OrganisasjonEnhet,
    ListeJuridiskeEnheter,
    Organisasjon,
    StatusFeilBedriftmeny,
} from './api';
import {
    finnJuridiskeEnheter,
    getJuridiskeEnheterFraBedrifter,
    getUnderEnheterFraBedrifter,
    getUnderenheterUtenJuridiskEnhet,
} from './kontruer-Utils';

export interface OrganisasjonData {
    organisasjonliste: Array<OrganisasjonEnhet>;
    feilstatus: Array<StatusFeilBedriftmeny> | undefined;
}

export async function konstruereOrganisasjonliste(organisasjoner: Organisasjon[]): Promise<OrganisasjonData> {
    const juridiskeEnheter = getJuridiskeEnheterFraBedrifter(organisasjoner);
    const underenheter = getUnderEnheterFraBedrifter(organisasjoner);
    const underenheterUtenJuridiskEnhet = getUnderenheterUtenJuridiskEnhet(underenheter, juridiskeEnheter);
    const feilstatus: Array<StatusFeilBedriftmeny> | undefined = [];

    if (underenheterUtenJuridiskEnhet.length > 0) {
        await finnJuridiskeEnheter(underenheterUtenJuridiskEnhet).then((juridiskeEnheterUtenTilgang) => {
            juridiskeEnheter.push(...juridiskeEnheterUtenTilgang.org);
            if (juridiskeEnheterUtenTilgang?.manglerJuridisk?.length > 0) {
                feilstatus.push({
                    status: Feilstatus.UNDERENHET_MANGLET_JURIDISK,
                    nivå: FeilNivå.WARNING,
                    gjeldeneOrg: juridiskeEnheterUtenTilgang.manglerJuridisk,
                });
            }
        });
    }
    const bedriftliste = settSammenJuridiskEnhetMedUnderenheter(juridiskeEnheter, underenheter);
    if (bedriftliste.feilstatus) {
        feilstatus.push(...bedriftliste.feilstatus);
    }

    return {
        organisasjonliste: bedriftliste.organisasjonliste.sort((a, b) =>
            a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name)
        ),
        feilstatus: feilstatus?.length > 0 ? feilstatus : undefined,
    };
}

const finJuridiskUtenUnderenheter = (organisasjonlist: OrganisasjonEnhet[]) =>
    organisasjonlist.filter((juridiskenhet) => juridiskenhet.Underenheter?.length === 0).map((o) => o.JuridiskEnhet);

function oppdatertFeilstatus(organisasjonlist: OrganisasjonEnhet[]) {
    let feilstatus: Array<StatusFeilBedriftmeny> | undefined = [];
    const JuridiskUtenUnderenheter: Organisasjon[] = finJuridiskUtenUnderenheter(organisasjonlist);

    if (JuridiskUtenUnderenheter?.length > 0) {
        feilstatus?.push({
            status: Feilstatus.JURIDISK_MANGLER_UNDERENHET,
            gjeldeneOrg: JuridiskUtenUnderenheter,
            nivå: FeilNivå.WARNING,
        });
    }
    if (!organisasjonlist || organisasjonlist?.length === 0) {
        feilstatus?.push({ status: Feilstatus.GREIDE_IKKE_BYGGE_ORGTRE, gjeldeneOrg: undefined, nivå: FeilNivå.ERROR });
    }
    const status = feilstatus.length > 0 ? feilstatus : undefined;
    return status;
}

const settSammenJuridiskEnhetMedUnderenheter = (
    enheter: Organisasjon[],
    underenheter: Organisasjon[]
): OrganisasjonData => {
    const juridiskenheter: OrganisasjonEnhet[] = enheter.map((enhet: Organisasjon) => ({
        JuridiskEnhet: enhet,
        Underenheter: underenheter.filter(
            (underenhet) => underenhet.ParentOrganizationNumber === enhet.OrganizationNumber
        ),
    }));
    return {
        organisasjonliste: juridiskenheter.filter((orgtre) => orgtre.Underenheter.length > 0),
        feilstatus: oppdatertFeilstatus(juridiskenheter),
    };
};

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgnr: { org: Organisasjon[]; nr: string },
    brregUrl: string
): Promise<{ org: Organisasjon[]; manglerJuridisk: Organisasjon[] }> {
    try {
        const respons = await fetch(brregUrl + listeMedJuridiskeOrgnr.nr);
        if (respons.ok && listeMedJuridiskeOrgnr.nr.length > 0) {
            const distinkteJuridiskeEnheterFraEreg: ListeJuridiskeEnheter = await respons.json();
            if (
                distinkteJuridiskeEnheterFraEreg._embedded &&
                distinkteJuridiskeEnheterFraEreg._embedded.enheter.length > 0
            ) {
                const funnetOrgSomMangletJuridiskOssBrreg = finnAlleJuridiskeEnheterSomBrregIkkeFant(
                    listeMedJuridiskeOrgnr,
                    distinkteJuridiskeEnheterFraEreg
                );
                const org = distinkteJuridiskeEnheterFraEreg._embedded.enheter.map((orgFraEereg) => {
                    return {
                        Name: orgFraEereg.navn,
                        Type: 'Enterprise',
                        OrganizationNumber: orgFraEereg.organisasjonsnummer,
                        OrganizationForm: orgFraEereg.organisasjonsform?.kode ?? 'AS',
                        Status: 'Active',
                        ParentOrganizationNumber: '',
                    };
                });

                return { org: org, manglerJuridisk: funnetOrgSomMangletJuridiskOssBrreg };
            }
        }
    } catch (e) {
        console.warn('kall til brreg.no feilet: ', e);
    }
    return lagBackupListeMedJuridiskeEnheter(listeMedJuridiskeOrgnr);
}

function finnAlleJuridiskeEnheterSomBrregIkkeFant(
    listeMedJuridiskeOrgnr: { org: Organisasjon[]; nr: string },
    distinkteJuridiskeEnheterFraEreg: ListeJuridiskeEnheter
): Organisasjon[] {
    const juridiskeEnheter = listeMedJuridiskeOrgnr.nr.split(',');
    distinkteJuridiskeEnheterFraEreg._embedded.enheter.forEach((enhet) => {
        const enhetIndex = juridiskeEnheter.indexOf(enhet.organisasjonsnummer);
        if (enhetIndex !== -1) {
            juridiskeEnheter.splice(enhetIndex, 1);
        }
    });
    return listeMedJuridiskeOrgnr.org.filter((org) =>
        listeMedJuridiskeOrgnr.nr.split(',').find((nr) => nr === org.ParentOrganizationNumber)
    );
}

function lagBackupListeMedJuridiskeEnheter(listeMedJuridiskeOrgnr: { org: Organisasjon[]; nr: string }) {
    const org = listeMedJuridiskeOrgnr.nr.split(',').map((orgnr) => {
        return {
            Name: `${orgnr} (Juridisk enhet) `,
            Type: 'Enterprise',
            OrganizationNumber: orgnr,
            OrganizationForm: 'AS',
            Status: 'Active',
            ParentOrganizationNumber: '',
        };
    });
    const funnetOrgSomMangletJuridiskOssBrreg = listeMedJuridiskeOrgnr.org.filter((org) =>
        listeMedJuridiskeOrgnr.nr.split(',').find((nr) => nr === org.ParentOrganizationNumber)
    );
    return { org: org, manglerJuridisk: funnetOrgSomMangletJuridiskOssBrreg };
}
