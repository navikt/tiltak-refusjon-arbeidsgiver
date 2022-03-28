import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { Bedriftvalg, BedriftvalgType, initPageData, Juridiskenhet, Organisasjon } from './organisasjon';
import { History } from 'history';
import {
    altinnOrganisasjonerErInitialisertMedEnIkkeTomList,
    compareBedriftvalg,
    definereDefaultBedriftvalgTypeUtfraOrganisasjonsMatch,
    hentOrgnummerFraUrl,
    hentUnderenheter,
    organisasjonerPaContextMatcherOrgFraUrl,
    organisasjonFraUrlMatchetMedAltinnOrganisasjonslist,
    settOrgnummerIgress,
    valgtBedriftTypePaContextErLikAlleBedrifter,
} from './organisasjon-Utils';
import { NavigateFunction } from 'react-router-dom';
import { useNavigate } from 'react-router';

function useOrganisasjon(
    orgtre: Juridiskenhet[] = [],
    history: History,
    valgtBedrift: Bedriftvalg | undefined,
    setValgtBedrift: (org: Bedriftvalg) => void,
    setBedriftvalg: Dispatch<SetStateAction<Bedriftvalg>>
) {
    const navigate: NavigateFunction = useNavigate();

    const getBedriftSearchkey = (org: Bedriftvalg): string => {
        if (org?.type === BedriftvalgType.ALLEBEDRIFTER) {
            return BedriftvalgType.ALLEBEDRIFTER;
        }
        return org?.valgtOrg.map((o) => o.OrganizationNumber).join(',');
    };

    const hentOrg = useCallback(() => {
        function settOrganisasjon(
            organisasjonsliste: Array<Organisasjon>,
            bedriftvalgType: BedriftvalgType,
            skalsettOrgNrIngress?: boolean
        ): void {
            if (skalsettOrgNrIngress) {
                settOrgnummerIgress(organisasjonsliste?.[0]?.OrganizationNumber ?? '', history);
            }

            const valgtorg = {
                type: bedriftvalgType,
                valgtOrg: organisasjonsliste,
                pageData: valgtBedrift?.pageData ?? initPageData,
                feilstatus: valgtBedrift?.feilstatus ?? undefined,
            };

            if (!compareBedriftvalg(valgtorg, valgtBedrift)) {
                setBedriftvalg(valgtorg);
                setValgtBedrift(valgtorg);
            }
        }

        function setFallbackOrganisasjon(): void {
            settOrganisasjon(
                orgtre.flatMap((org) => org.Underenheter),
                BedriftvalgType.ALLEBEDRIFTER,
                true
            );
        }

        function finnOgMatchOrganisasjonerFraAdresseFelt(orgnummerFraUrl: string): void {
            const organisasjoner = organisasjonFraUrlMatchetMedAltinnOrganisasjonslist(orgtre, orgnummerFraUrl);
            const type = definereDefaultBedriftvalgTypeUtfraOrganisasjonsMatch(organisasjoner);

            if (organisasjoner) {
                return settOrganisasjon(organisasjoner, type);
            }
            return setFallbackOrganisasjon();
        }

        function settOrganisasjonUtfraAlleBedriftDefinertPaContext(orgnummerFraUrl: string | null): void {
            if (BedriftvalgType.ALLEBEDRIFTER === orgnummerFraUrl) {
                return;
            }
            if (valgtBedrift && valgtBedrift?.valgtOrg?.length > 0) {
                return settOrganisasjon(valgtBedrift.valgtOrg, BedriftvalgType.ALLEBEDRIFTER);
            }
            return settOrganisasjon(hentUnderenheter(orgtre), BedriftvalgType.ALLEBEDRIFTER);
        }

        function hentOgSjekkOrgnrIngress(): void {
            if (altinnOrganisasjonerErInitialisertMedEnIkkeTomList(orgtre)) {
                const orgnummerFraUrl: string | null = hentOrgnummerFraUrl();

                if (valgtBedriftTypePaContextErLikAlleBedrifter(valgtBedrift?.type)) {
                    return settOrganisasjonUtfraAlleBedriftDefinertPaContext(orgnummerFraUrl);
                }
                if (orgnummerFraUrl === BedriftvalgType.ALLEBEDRIFTER) {
                    return settOrganisasjon(hentUnderenheter(orgtre), BedriftvalgType.ALLEBEDRIFTER);
                }
                if (organisasjonerPaContextMatcherOrgFraUrl(valgtBedrift?.valgtOrg, orgnummerFraUrl)) {
                    return;
                }
                if (orgnummerFraUrl) {
                    return finnOgMatchOrganisasjonerFraAdresseFelt(orgnummerFraUrl);
                }
                return setFallbackOrganisasjon();
            }
        }

        function hentOgSjekkOrgnrIngress2(): void {
            if (altinnOrganisasjonerErInitialisertMedEnIkkeTomList(orgtre)) {
                const orgnummerFraUrl: string | null = hentOrgnummerFraUrl();
            }
        }

        function sjekkOgSettValgtOrgnrUrlparams(): () => void {
            hentOgSjekkOrgnrIngress();
            return history.listen(hentOgSjekkOrgnrIngress);
        }

        sjekkOgSettValgtOrgnrUrlparams();
    }, [orgtre, history, setValgtBedrift, valgtBedrift, setBedriftvalg]);

    return useMemo(() => ({ hentOrg }), [hentOrg]);
}
export default useOrganisasjon;
