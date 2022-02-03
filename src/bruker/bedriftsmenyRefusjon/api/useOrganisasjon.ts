import { useCallback, useMemo } from 'react';
import { Bedriftvalg, BedriftvalgType, Juridiskenhet, Organisasjon } from './organisasjon';
import { hentUnderenheter, settOrgnummerIgress } from './organisasjonUtils';
import { History } from 'history';

const hentOrgnummerFraUrl = () => new URL(window.location.href).searchParams.get('bedrift');

function useOrganisasjon(
    orgtre: Juridiskenhet[] = [],
    history: History,
    valgtBedrift: Bedriftvalg | undefined,
    setValgtBedrift: (org: Bedriftvalg) => void
) {
    const hentOrg = useCallback(() => {
        function settOrganisasjon(
            organisasjonsliste: Array<Organisasjon>,
            bedriftvalgType: BedriftvalgType,
            settOrgnrUrl?: boolean
        ): void {
            if (settOrgnrUrl) {
                settOrgnummerIgress(organisasjonsliste?.[0]?.OrganizationNumber ?? '', history);
            }
            setValgtBedrift({ type: valgtBedrift?.type ?? bedriftvalgType, valgtOrg: organisasjonsliste });
        }

        function setFallbackOrganisasjon(): void {
            settOrganisasjon([orgtre[0].Underenheter[0]], BedriftvalgType.ENKELBEDRIFT, true);
        }

        function finnOgMatchOrganisasjoner(orgnummerFraUrl: string): void {
            const ENKELT_BEDRIFT_URL = 1;
            if (orgnummerFraUrl === BedriftvalgType.ALLEBEDRIFTER) {
                return settOrganisasjon(hentUnderenheter(orgtre), BedriftvalgType.ALLEBEDRIFTER);
            }

            const underenheter: Organisasjon[] = hentUnderenheter(orgtre);
            const organisasjonReferertIUrl = underenheter.filter((org) =>
                orgnummerFraUrl.split(',').includes(org.OrganizationNumber)
            );
            const type =
                organisasjonReferertIUrl.length > ENKELT_BEDRIFT_URL
                    ? BedriftvalgType.FLEREBEDRIFTER
                    : BedriftvalgType.ENKELBEDRIFT;

            organisasjonReferertIUrl ? settOrganisasjon(organisasjonReferertIUrl, type) : setFallbackOrganisasjon();
        }

        function hentOgSettOrgnrFraUrl(): void {
            if (orgtre.length > 0) {
                const orgnummerFraUrl = hentOrgnummerFraUrl();

                if (valgtBedrift?.type === BedriftvalgType.ALLEBEDRIFTER) {
                    if (BedriftvalgType.ALLEBEDRIFTER === orgnummerFraUrl) {
                        return;
                    }
                    if (valgtBedrift?.valgtOrg?.length > 0) {
                        settOrganisasjon(valgtBedrift.valgtOrg, BedriftvalgType.ALLEBEDRIFTER);
                    }
                    return orgtre?.length > 0
                        ? settOrganisasjon(hentUnderenheter(orgtre), BedriftvalgType.ALLEBEDRIFTER)
                        : setFallbackOrganisasjon();
                }

                if (valgtBedrift?.valgtOrg.map((o) => o.OrganizationNumber).join(',') === orgnummerFraUrl) {
                    return;
                }

                orgnummerFraUrl ? finnOgMatchOrganisasjoner(orgnummerFraUrl) : setFallbackOrganisasjon();
            }
        }

        function sjekkOgSettValgtOrgnrUrlparams(): () => void {
            hentOgSettOrgnrFraUrl();
            return history.listen(hentOgSettOrgnrFraUrl);
        }

        sjekkOgSettValgtOrgnrUrlparams();
    }, [orgtre, history, setValgtBedrift, valgtBedrift]);

    return useMemo(() => ({ hentOrg }), [hentOrg]);
}
export default useOrganisasjon;
