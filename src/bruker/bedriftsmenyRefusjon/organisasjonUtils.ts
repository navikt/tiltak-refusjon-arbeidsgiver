import { Juridiskenhet, Organisasjon } from './organisasjon';

const ORGNUMMER_PARAMETER = 'bedrift';

export const settOrgnummerIUrl = (orgnummer: string, history: History) => {
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
