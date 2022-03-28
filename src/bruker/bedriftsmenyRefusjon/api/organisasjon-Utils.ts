import { Bedriftvalg, BedriftvalgType, Juridiskenhet, Organisasjon } from './organisasjon';
import { History } from 'history';

const ORGNUMMER_PARAMETER = 'bedrift';
const ENKELT_BEDRIFT_URL = 1;

export const settOrgnummerIgress = (orgnummer: string, history: History) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set(ORGNUMMER_PARAMETER, orgnummer);
    const { search } = currentUrl;
    (history as any).replace({ search });
};

export const hentUnderenheter = (organisasjonstre: Juridiskenhet[]) =>
    organisasjonstre.reduce(
        (organisasjoner: Organisasjon[], parentOrg) => [...organisasjoner, ...parentOrg.Underenheter],
        []
    );

export const hentOrgnummerFraUrl = () => new URL(window.location.href).searchParams.get(ORGNUMMER_PARAMETER);

export const altinnOrganisasjonerErInitialisertMedEnIkkeTomList = (orgtre: Juridiskenhet[]) => orgtre.length > 0;

export const filtrerOrgMatchUrl = (orgtre: Juridiskenhet[], orgnummerFraUrl: string | null) =>
    hentUnderenheter(orgtre).filter((org) => orgnummerFraUrl?.split(',').includes(org.OrganizationNumber));

export const definerDefaultBedriftvalgType = (
    orgnummerFraUrl: string | null,
    valgtBedrift: Bedriftvalg | undefined
): BedriftvalgType => {
    if (orgnummerFraUrl) {
        switch (true) {
            case orgnummerFraUrl === BedriftvalgType.ALLEBEDRIFTER:
                return BedriftvalgType.ALLEBEDRIFTER;
            case orgnummerFraUrl.split(',').length > ENKELT_BEDRIFT_URL:
                return BedriftvalgType.FLEREBEDRIFTER;
            default:
                return BedriftvalgType.ENKELBEDRIFT;
        }
    }
    return valgtBedrift?.type ?? BedriftvalgType.ALLEBEDRIFTER;
};

export const organisasjonerPaContextMatcherOrgFraUrl = (
    valgtOrg: Organisasjon[] | undefined,
    orgnummerFraUrl: string | null
) => {
    const valgtOrganisasjoner: string | undefined = valgtOrg?.map((o) => o.OrganizationNumber).join(',');
    return valgtOrganisasjoner === orgnummerFraUrl || valgtOrganisasjoner === BedriftvalgType.ALLEBEDRIFTER;
};

const serializeOrgNr = (valgtOrg: Array<Organisasjon> | undefined): string | undefined =>
    valgtOrg?.map((o) => o.OrganizationNumber).join(',');

export const bedriftContextInitialisert = (
    valgtBedrift: Bedriftvalg | undefined,
    bedriftvalg: Bedriftvalg | undefined,
    orgnummerFraUrl: string | null
): boolean => {
    const valgtOrganisasjoner: string | undefined = serializeOrgNr(valgtBedrift?.valgtOrg);
    return valgtOrganisasjoner === serializeOrgNr(bedriftvalg?.valgtOrg) || valgtOrganisasjoner === orgnummerFraUrl;
};

export function compareBedriftvalg(valgtorg: Bedriftvalg, valgtBedrift: Bedriftvalg | undefined, keys?: string[]) {
    let erLik: boolean = !!valgtBedrift;
    if (valgtBedrift) {
        const objectKeys = keys ?? Object.keys(valgtorg);
        for (const key of objectKeys) {
            if (typeof valgtorg[key] === 'object') {
                const subkeys = Object.keys(valgtorg[key]);
                for (const subkey of subkeys) {
                    if (valgtorg[key][subkey] !== valgtBedrift[key][subkey]) {
                        erLik = false;
                    }
                }
            } else if (valgtorg[key] !== valgtBedrift[key]) {
                erLik = false;
            }
        }
    }
    return erLik;
}
