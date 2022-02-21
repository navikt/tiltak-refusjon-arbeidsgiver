import { BedriftvalgType, Juridiskenhet, Organisasjon } from './organisasjon';
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

export const hentOrgnummerFraUrl = () => new URL(window.location.href).searchParams.get('bedrift');

export const altinnOrganisasjonerErInitialisertMedEnIkkeTomList = (orgtre: Juridiskenhet[]) => orgtre.length > 0;

export const organisasjonFraUrlMatchetMedAltinnOrganisasjonslist = (orgtre: Juridiskenhet[], orgnummerFraUrl: string) =>
    hentUnderenheter(orgtre).filter((org) => orgnummerFraUrl.split(',').includes(org.OrganizationNumber));

export const definereDefaultBedriftvalgTypeUtfraOrganisasjonsMatch = (organisasjoner: Organisasjon[]) =>
    organisasjoner.length > ENKELT_BEDRIFT_URL ? BedriftvalgType.FLEREBEDRIFTER : BedriftvalgType.ENKELBEDRIFT;

export const valgtBedriftTypePaContextErLikAlleBedrifter = (type: BedriftvalgType | undefined) =>
    type === BedriftvalgType.ALLEBEDRIFTER;

export const organisasjonerPaContextMatcherOrgFraUrl = (
    valgtOrg: Organisasjon[] | undefined,
    orgnummerFraUrl: string | null
) => valgtOrg?.map((o) => o.OrganizationNumber).join(',') === orgnummerFraUrl;
