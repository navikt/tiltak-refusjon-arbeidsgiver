import axios, { AxiosResponse } from 'axios';
import useSWR, { SWRConfiguration, mutate } from 'swr';
import { BrukerContextType, InnloggetBruker } from '../bruker/BrukerContextType';
import { Bedriftvalg, BedriftvalgType } from '../bruker/bedriftsmenyRefusjon/api/api';
import { Filter } from '../refusjon/oversikt/FilterContext';
import { Korreksjon, PageableRefusjon, Refusjon } from '../refusjon/refusjon';
import { RefusjonStatus } from '../refusjon/status';
import { Tiltak } from '../refusjon/tiltak';

export class FeilkodeError extends Error {}
export class ApiError extends Error {}

const api = axios.create({
    baseURL: '/api/arbeidsgiver',
    timeout: 35000,
    withCredentials: true,
    headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
    validateStatus: (status) => status < 400,
});

const axiosFetcher = (url: string): Promise<any> => api.get(url).then((res: AxiosResponse<any>) => res.data);

const swrConfig: SWRConfiguration = {
    fetcher: axiosFetcher,
    suspense: true,
    revalidateOnFocus: false,
    refreshInterval: 120000,
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
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
    console.log('LAGRE KID: ', bedriftKID, bedriftKID?.trim().length, bedriftKID === undefined);
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

export const useHentRefusjoner = (brukerContext: BrukerContextType, filter: Filter): PageableRefusjon => {
    const { valgtBedrift } = brukerContext;
    switch (brukerContext.valgtBedrift.type) {
        case BedriftvalgType.ALLEBEDRIFTER:
            return HentRefusjonForMangeOrganisasjoner(BedriftvalgType.ALLEBEDRIFTER, valgtBedrift, filter);
        default:
            return HentRefusjonForMangeOrganisasjoner(
                valgtBedrift.valgtOrg.map((e) => e.OrganizationNumber).join(','),
                valgtBedrift,
                filter
            );
    }
};

export const HentRefusjonForMangeOrganisasjoner = (
    bedriftlist: string,
    valgtBedrift: Bedriftvalg,
    filter: Filter
): PageableRefusjon => {
    const { page, pagesize } = valgtBedrift.pageData;
    const { data } = useSWR<PageableRefusjon>(
        `/refusjon/hentliste?bedriftNr=${bedriftlist}&page=${page}&size=${pagesize}&&status=${
            filter.status || ''
        }&tiltakstype=${filter.tiltakstype || ''}&sortingOrder=${filter.sorting || ''}`,
        swrConfig
    );
    return data!;
};

export const useHentRefusjon = (refusjonId?: string): Refusjon => {
    const parameter = refusjonId ? `/refusjon/${refusjonId}` : null;
    const { data } = useSWR<Refusjon>(parameter, swrConfig);
    return data!;
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
