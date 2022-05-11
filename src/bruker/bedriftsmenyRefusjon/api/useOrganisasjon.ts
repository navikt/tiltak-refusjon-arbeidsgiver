import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { Bedriftvalg, BedriftvalgType, initPageData, Juridiskenhet, Organisasjon } from './organisasjon';
import { History } from 'history';
import {
    altinnOrganisasjonerErInitialisertMedEnIkkeTomList,
    filtrerOrgMatchUrl,
    hentOrgnummerFraUrl,
    appendUrl,
    bedriftContextInitialisert,
    definerDefaultBedriftvalgType,
} from './organisasjon-Utils';

function useOrganisasjon(
    orgtre: Juridiskenhet[] = [],
    history: History,
    valgtBedrift: Bedriftvalg | undefined,
    setValgtBedrift: (org: Bedriftvalg) => void,
    bedriftvalg: Bedriftvalg | undefined,
    setBedriftvalg: Dispatch<SetStateAction<Bedriftvalg>>
) {
    /*    const navigate: NavigateFunction = useNavigate();

    const getBedriftSearchkey = (org: Bedriftvalg): string => {
        if (org?.type === BedriftvalgType.ALLEBEDRIFTER) {
            return BedriftvalgType.ALLEBEDRIFTER;
        }
        return org?.valgtOrg.map((o) => o.OrganizationNumber).join(',');
    };*/

    const initBedriftmenyContext = useCallback(() => {
        function settOrganisasjon(
            organisasjonsliste: Array<Organisasjon>,
            bedriftvalgType: BedriftvalgType,
            skalsettOrgNrIngress?: boolean
        ): void {
            if (skalsettOrgNrIngress) {
                appendUrl(organisasjonsliste.map((o) => o.OrganizationNumber).join(',') ?? '', history);
            }
            const valgtorg = {
                type: bedriftvalgType,
                valgtOrg: organisasjonsliste,
                pageData: valgtBedrift?.pageData ?? initPageData,
                feilstatus: valgtBedrift?.feilstatus ?? undefined,
            };
            setBedriftvalg(valgtorg);
            setValgtBedrift(valgtorg);
        }
        //
        function setFallbackOrganisasjon(type: BedriftvalgType): void {
            settOrganisasjon(
                orgtre.flatMap((org) => org.Underenheter),
                type,
                true
            );
        }

        function settBedriftContext(orgnummerFraUrl: string | null): void {
            const organisasjoner: Organisasjon[] = filtrerOrgMatchUrl(orgtre, orgnummerFraUrl);
            const type = definerDefaultBedriftvalgType(orgnummerFraUrl, valgtBedrift);
            if (organisasjoner.length > 0) {
                return settOrganisasjon(organisasjoner, type);
            }
            return setFallbackOrganisasjon(type);
        }

        function sjekkOgInitBedriftmenyContext(): void {
            if (altinnOrganisasjonerErInitialisertMedEnIkkeTomList(orgtre)) {
                const orgnummerFraUrl: string | null = hentOrgnummerFraUrl();
                if (bedriftContextInitialisert(valgtBedrift, bedriftvalg, orgnummerFraUrl)) {
                    return;
                }
                settBedriftContext(orgnummerFraUrl);
            }
        }

        function initUseOrg(): () => void {
            sjekkOgInitBedriftmenyContext();
            return history.listen(sjekkOgInitBedriftmenyContext);
        }

        initUseOrg();
    }, [orgtre, history, setValgtBedrift, valgtBedrift, bedriftvalg, setBedriftvalg]);

    return useMemo(() => ({ initBedriftmenyContext }), [initBedriftmenyContext]);
}
export default useOrganisasjon;
