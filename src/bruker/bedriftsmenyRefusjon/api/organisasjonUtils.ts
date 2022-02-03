import { Juridiskenhet, Organisasjon } from './organisasjon';
import { History } from 'history';

const ORGNUMMER_PARAMETER = 'bedrift';

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
