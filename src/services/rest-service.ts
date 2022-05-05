import axios, { AxiosResponse } from 'axios';
import useSWR, { mutate } from 'swr';
import { Bedriftvalg, BedriftvalgType } from '../bruker/bedriftsmenyRefusjon/api/organisasjon';
import { BrukerContextType, InnloggetBruker } from '../bruker/BrukerContextType';
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

/*const getAxiosRequestMethod = (url: string, method: string, data?: Object) => {
    switch (method) {
        case 'post':
            return api
                .post(url, { ...data })
                .then((res: AxiosResponse<any>) => res.data)
                .catch((err) => console.log('operasjon feilet. response: ', err));
        case 'get':
        default:
            return api
                .get(url)
                .then((res: AxiosResponse<any>) => res.data)
                .catch((err) => console.log('operasjon feilet. response: ', err));
    }
};*/

const axiosFetcher = (url: string): Promise<any> => api.get(url).then((res: AxiosResponse<any>) => res.data);

const swrConfig = {
    fetcher: axiosFetcher,
    suspense: true,
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
        console.log('err.response ', err.response);
        return err;
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

export const setInntektslinjeOpptjentIPeriode = async (
    refusjonId: string,
    inntektslinjeId: string,
    erOpptjentIPeriode: boolean
): Promise<void> => {
    const response = await api.post(`/refusjon/${refusjonId}/set-inntektslinje-opptjent-i-periode`, {
        inntektslinjeId,
        erOpptjentIPeriode,
    });

    let formData = new FormData();
    formData.append('inntektslinjeId', inntektslinjeId);
    formData.append('erOpptjentIPeriode', erOpptjentIPeriode.toString());

    fetch(`/api/arbeidsgiver/refusjon/${refusjonId}/set-inntektslinje-opptjent-i-periode`, {
        method: 'POST',
        body: JSON.stringify({
            inntektslinjeId: inntektslinjeId,
            erOpptjentIPeriode: erOpptjentIPeriode,
        }),
        headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache', 'content-type': 'application/json' },
    })
        .then((response) => response.body)
        .then((res) => console.log('res'));

    await mutate(`/refusjon/${refusjonId}`);
    console.log('response: ', response);
    return response.data;
};

export const godkjennRefusjon = async (refusjonId: string): Promise<any> => {
    const response = await api.post(`/refusjon/${refusjonId}/godkjenn`);
    await mutate(`/refusjon/${refusjonId}`);
    return response.data;
};

export const useHentRefusjoner = (
    brukerContext: BrukerContextType,
    status?: RefusjonStatus,
    tiltakstype?: Tiltak
): PageableRefusjon => {
    const { valgtBedrift } = brukerContext;
    switch (brukerContext.valgtBedrift.type) {
        case BedriftvalgType.ENKELBEDRIFT:
            return HentRefusjonerForEnkeltOrganisasjon(brukerContext, status, tiltakstype);
        case BedriftvalgType.FLEREBEDRIFTER:
            return HentRefusjonForMangeOrganisasjoner(
                valgtBedrift.valgtOrg.map((e) => e.OrganizationNumber).join(','),
                valgtBedrift,
                status,
                tiltakstype
            );
        case BedriftvalgType.ALLEBEDRIFTER:
            return HentRefusjonForMangeOrganisasjoner(BedriftvalgType.ALLEBEDRIFTER, valgtBedrift, status, tiltakstype);
    }
};

export const HentRefusjonerForEnkeltOrganisasjon = (
    brukerContext: BrukerContextType,
    status?: RefusjonStatus,
    tiltakstype?: Tiltak
): PageableRefusjon => {
    const { currentPage, totalPages, totalItems, size } = brukerContext.valgtBedrift.pageData;
    const bedriftnummer = brukerContext.valgtBedrift.valgtOrg[0].OrganizationNumber;
    const { data } = useSWR<Refusjon[]>(
        `/refusjon?bedriftNr=${bedriftnummer}&status=${status || ''}&tiltakstype=${tiltakstype || ''}`,
        swrConfig
    );
    return {
        currentPage: currentPage,
        refusjoner: data!,
        size: size,
        totalItems: totalItems,
        totalPages: totalPages,
    };
};

export const HentRefusjonForMangeOrganisasjoner = (
    bedriftlist: string,
    valgtBedrift: Bedriftvalg,
    status?: RefusjonStatus,
    tiltakstype?: Tiltak
): PageableRefusjon => {
    const { page, pagesize } = valgtBedrift.pageData;
    const { data } = useSWR<PageableRefusjon>(
        `/refusjon/hentliste?bedriftNr=${bedriftlist}&page=${page}&size=${pagesize}&&status=${
            status || ''
        }&tiltakstype=${tiltakstype || ''}`,
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
