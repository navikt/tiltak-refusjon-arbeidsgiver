import axios, { AxiosResponse } from 'axios';
import useSWR, { SWRConfiguration, mutate } from 'swr';
import { BrukerContextType, InnloggetBruker } from '../bruker/BrukerContextType';
import { BedriftvalgType } from '../bruker/bedriftsmenyRefusjon/api/api';
import { Filter } from '../refusjon/oversikt/FilterContext';
import { Korreksjon, PageableRefusjon, Refusjon } from '../refusjon/refusjon';

export class FeilkodeError extends Error {}
export class ApiError extends Error {}
export class AutentiseringError extends ApiError {}

const api = axios.create({
    baseURL: '/api/arbeidsgiver',
    timeout: 35000,
    withCredentials: true,
    headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
    validateStatus: (status) => status < 400,
});

const axiosFetcher = (url: string, refusjon?: Refusjon): Promise<any> =>
    api
        .get(url, {
            headers: { 'If-Unmodified-Since': refusjon ? (refusjon.sistEndret ? refusjon.sistEndret : null) : null },
        })
        .then((res: AxiosResponse<any>) => res.data);

const swrConfig: SWRConfiguration = {
    fetcher: axiosFetcher,
    suspense: true,
    revalidateOnFocus: false,
    refreshInterval: 120000,
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            throw new AutentiseringError('Er ikke logget inn.');
        }
        if (error.response?.status === 400 && error.response?.headers.feilkode) {
            throw new FeilkodeError(error.response?.headers.feilkode);
        }
        throw new ApiError('Feil ved kontakt mot baksystem.');
    }
);

export const hentInnloggetBruker = async (): Promise<InnloggetBruker> => {
    const response = await api.get<InnloggetBruker>(`/innlogget-bruker`).catch((err) => {
        console.log('err.response ', err);
        throw err;
    });
    return response.data;
};

export const endreBruttolønn = async (
    refusjonId: string,
    inntekterKunFraTiltaket: boolean | null,
    bruttoLønn?: number | null
): Promise<any> => {
    const response = await api.post(`/refusjon/${refusjonId}/endre-bruttolønn`, {
        inntekterKunFraTiltaket,
        bruttoLønn,
    });
    await mutate(`/refusjon/${refusjonId}`);
    return response.data;
};

export const lagreBedriftKID = async (refusjonId: string, bedriftKID: string | undefined): Promise<any> => {
    if (bedriftKID?.trim().length === 0) {
        bedriftKID = undefined;
    }
    const response = await api.post(`/refusjon/${refusjonId}/lagre-bedriftKID`, {
        bedriftKID,
    });
    await mutate(`/refusjon/${refusjonId}`);
    return response.data;
};

export const settTidligereRefunderbarBeløp = async (
    refusjonId: string,
    fratrekkRefunderbarBeløp: boolean | null,
    refunderbarBeløp?: number | null
): Promise<any> => {
    const response = await api.post(`/refusjon/${refusjonId}/fratrekk-sykepenger`, {
        fratrekkRefunderbarBeløp,
        refunderbarBeløp,
    });
    await mutate(`/refusjon/${refusjonId}`);
    return response.data;
};

export const utsettFriskSykepenger = async (refusjonId: string): Promise<any> => {
    const response = await api.post(`/refusjon/${refusjonId}/utsett-frist`);
    await mutate(`/refusjon/${refusjonId}`);
    return response.data;
};

export const setInntektslinjeOpptjentIPeriode = async (
    refusjonId: string,
    inntektslinjeId: string,
    erOpptjentIPeriode: boolean
): Promise<void> => {
    await api.post(`/refusjon/${refusjonId}/set-inntektslinje-opptjent-i-periode`, {
        inntektslinjeId: inntektslinjeId,
        erOpptjentIPeriode: erOpptjentIPeriode,
    });
    await mutate(`/refusjon/${refusjonId}`);
};

export const godkjennRefusjon = async (refusjonId: string): Promise<any> => {
    const response = await api.post(`/refusjon/${refusjonId}/godkjenn`);
    await mutate(`/refusjon/${refusjonId}`);
    return response.data;
};

export const godkjennRefusjonMedNullbeløp = async (refusjonId: string): Promise<any> => {
    const response = await api.post(`/refusjon/${refusjonId}/godkjenn-nullbeløp`);
    await mutate(`/refusjon/${refusjonId}`);
    return response.data;
};

export const useHentRefusjoner = (brukerContext: BrukerContextType, filter: Filter): PageableRefusjon => {
    const { valgtBedrift } = brukerContext;
    switch (brukerContext.valgtBedrift.type) {
        case BedriftvalgType.ALLEBEDRIFTER:
            return HentRefusjonForMangeOrganisasjoner(BedriftvalgType.ALLEBEDRIFTER, filter);
        default:
            return HentRefusjonForMangeOrganisasjoner(
                valgtBedrift.valgtOrg.map((e) => e.OrganizationNumber).join(','),
                filter
            );
    }
};

export const HentRefusjonForMangeOrganisasjoner = (bedriftlist: string, filter: Filter): PageableRefusjon => {
    const urlSearchParams = new URLSearchParams(removeEmpty(filter));
    const { data } = useSWR<PageableRefusjon>(
        `/refusjon/hentliste?bedriftNr=${bedriftlist}&${urlSearchParams}`,
        swrConfig
    );
    return data!;
};

const removeEmpty = (obj: any) => {
    Object.keys(obj).forEach((k) => !obj[k] && delete obj[k]);
    return obj;
};

export const useHentRefusjon = (refusjonId?: string, sistEndret?: string): Refusjon => {
    const parameter = refusjonId ? `/refusjon/${refusjonId}` : null;
    const { data } = useSWR<Refusjon>(parameter, swrConfig);
    return data!;
};

export const hentInntekter = async (refusjonId?: string, sistEndret?: string) => {
    //const parameter = refusjonId ? `/refusjon/${refusjonId}/finn-inntekter` : null;
    //useSWR<Refusjon>(parameter, swrConfig);
    console.log('Henter inntekter med sistEndret', sistEndret);
    await api.post(`/refusjon/${refusjonId}/finn-inntekter`, null, {
        headers: {
            'If-Unmodified-Since': sistEndret,
        },
    });
    await mutate(`/refusjon/${refusjonId}`);
};

export const oppdaterRefusjonFetcher = async (key: string, { arg }: { arg: string }) => {
    console.log('Henter inntekter med sistEndret', arg);
    await api.post(`${key}/oppdater-refusjon`, null, {
        headers: {
            'If-Unmodified-Since': arg,
        },
    });
};

export const hentInntekterFetcher = async (key: string, { arg }: { arg: string }) => {
    console.log('Henter inntekter med sistEndret', arg);
    await api.post(`${key}/finn-inntekter`, null, {
        headers: {
            'If-Unmodified-Since': arg,
        },
    });
};

export const hentBedriftkontonummer = async (key: string, { arg }: { arg: string }) => {
    await api.post(`${key}/finn-bedriftkontonummer`, null, {
        headers: {
            'If-Unmodified-Since': arg,
        },
    });
};

export const useHentTidligereRefusjoner = (refusjonId: string): Refusjon[] => {
    const { data } = useSWR<Refusjon[]>(`/refusjon/${refusjonId}/tidligere-refusjoner`, swrConfig);
    return data!;
};

export const useHentKorreksjon = (korreksjonId: string): Korreksjon => {
    const { data } = useSWR<Korreksjon>(`/korreksjon/${korreksjonId}`, swrConfig);
    return data!;
};

export const hentInntekterLengerFrem = async (refusjonId: string, merking: boolean): Promise<void> => {
    await api.post(`/refusjon/${refusjonId}/merk-for-hent-inntekter-frem`, { merking });
    await mutate(`/refusjon/${refusjonId}`);
};
