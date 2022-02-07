import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { Bedriftvalg, BedriftvalgType, Juridiskenhet, Organisasjon } from './organisasjon';
import { hentUnderenheter, settOrgnummerIgress } from './organisasjonUtils';
import { History } from 'history';
import {
    altinnOrganisasjonerErInitialisertMedEnIkkeTomList,
    definereDefaultBedriftvalgTypeUtfraOrganisasjonsMatch,
    hentOrgnummerFraUrl,
    organisasjonerPaContextMatcherOrgFraUrl,
    organisasjonFraUrlMatchetMedAltinnOrganisasjonslist,
    valgtBedriftTypePaContextErLikAlleBedrifter,
} from './organisasjon-Utils';

function useOrganisasjon(
    orgtre: Juridiskenhet[] = [],
    history: History,
    valgtBedrift: Bedriftvalg | undefined,
    setValgtBedrift: (org: Bedriftvalg) => void,
    setBedriftvalg: Dispatch<SetStateAction<Bedriftvalg>>
) {
    const hentOrg = useCallback(() => {
        function settOrganisasjon(
            organisasjonsliste: Array<Organisasjon>,
            bedriftvalgType: BedriftvalgType,
            skalsettOrgNrIngress?: boolean
        ): void {
            if (skalsettOrgNrIngress) {
                settOrgnummerIgress(organisasjonsliste?.[0]?.OrganizationNumber ?? '', history);
            }
            const valgtorg = { type: valgtBedrift?.type ?? bedriftvalgType, valgtOrg: organisasjonsliste };
            setBedriftvalg(valgtorg);
            setValgtBedrift(valgtorg);
        }

        function setFallbackOrganisasjon(): void {
            settOrganisasjon([orgtre[0].Underenheter[0]], BedriftvalgType.ENKELBEDRIFT, true);
        }

        function finnOgMatchOrganisasjonerFraAdresseFelt(orgnummerFraUrl: string): void {
            const organisasjoner = organisasjonFraUrlMatchetMedAltinnOrganisasjonslist(orgtre, orgnummerFraUrl);
            const type = definereDefaultBedriftvalgTypeUtfraOrganisasjonsMatch(organisasjoner);

            if (organisasjoner) {
                return settOrganisasjon(organisasjoner, type);
            }
            return setFallbackOrganisasjon();
        }

        function settOrganisasjonUtfraAlleBedriftDefinertPaContext(orgnummerFraUrl: string | null) {
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
                const orgnummerFraUrl = hentOrgnummerFraUrl();

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

        function sjekkOgSettValgtOrgnrUrlparams(): () => void {
            hentOgSjekkOrgnrIngress();
            return history.listen(hentOgSjekkOrgnrIngress);
        }

        sjekkOgSettValgtOrgnrUrlparams();
    }, [orgtre, history, setValgtBedrift, valgtBedrift, setBedriftvalg]);

    return useMemo(() => ({ hentOrg }), [hentOrg]);
}
export default useOrganisasjon;
