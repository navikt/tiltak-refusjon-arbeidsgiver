import { useCallback, useMemo, useState } from 'react';
import { Juridiskenhet, Organisasjon } from './organisasjon';
import { hentUnderenheter, settOrgnummerIUrl } from './organisasjonUtils';
import { History } from 'history';

const hentOrgnummerFraUrl = () => new URL(window.location.href).searchParams.get('bedrift');

function useOrganisasjon(orgtre: Juridiskenhet[] = [], history: History, setValgtBedrift: (org: Organisasjon) => void) {
    const [valgtOrg, setValgtOrg] = useState<Organisasjon | undefined>(undefined);

    const hentOrg = useCallback(() => {
        function velgOrganisasjon(organisasjon: Organisasjon, settOrgnrUrl?: boolean): void {
            if (settOrgnrUrl) {
                settOrgnummerIUrl(organisasjon.OrganizationNumber, history);
            }

            setValgtOrg(organisasjon);
            setValgtBedrift(organisasjon);
        }

        const setFallbackOrg = (): void => velgOrganisasjon(orgtre[0].Underenheter[0], true);

        function velgOrganisasjonMedUrl(orgnummerFraUrl: string): void {
            const underenheter = hentUnderenheter(orgtre);
            const organisasjonReferertIUrl = underenheter.find((org) => org.OrganizationNumber === orgnummerFraUrl);
            organisasjonReferertIUrl ? velgOrganisasjon(organisasjonReferertIUrl) : setFallbackOrg();
        }

        function brukOrgnummerFraUrl(): void {
            if (orgtre.length > 0) {
                const orgnummerFraUrl = hentOrgnummerFraUrl();
                if (valgtOrg && valgtOrg.OrganizationNumber === orgnummerFraUrl) {
                    return;
                }
                orgnummerFraUrl ? velgOrganisasjonMedUrl(orgnummerFraUrl) : setFallbackOrg();
            }
        }

        function velgOrganisasjonOgLyttUrl(): () => void {
            brukOrgnummerFraUrl();
            return history.listen(brukOrgnummerFraUrl);
        }

        velgOrganisasjonOgLyttUrl();
    }, [orgtre, history, valgtOrg, setValgtBedrift]);

    return useMemo(() => ({ hentOrg, valgtOrg }), [hentOrg, valgtOrg]);
}
export default useOrganisasjon;
