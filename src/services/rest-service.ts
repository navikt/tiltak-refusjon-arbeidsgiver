import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { InnloggetBruker } from '../bruker/BrukerContextType';
import { Refusjon } from '../refusjon/refusjon';
import { Status } from '../refusjon/status';
import { Tiltak } from '../refusjon/tiltak';

export class FeilkodeError extends Error {}
export class ApiError extends Error {}

const api = axios.create({
    baseURL: '/api/arbeidsgiver',
    timeout: 30000,
    withCredentials: true,
    headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
    validateStatus: (status) => status < 400,
});

const axiosFetcher = (url: string) => api.get(url).then((res) => res.data);

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

export const endreBruttolønn = async (refusjonId: string, inntekterKunFraTiltaket: boolean, bruttoLønn?: number) => {
    const response = await api.post(`/refusjon/${refusjonId}/endre-bruttolønn`, {
        inntekterKunFraTiltaket,
        bruttoLønn,
    });
    await mutate(`/refusjon/${refusjonId}`);
    return response.data;
};

export const godkjennRefusjon = async (refusjonId: string) => {
    const response = await api.post(`/refusjon/${refusjonId}/godkjenn`);
    await mutate(`/refusjon/${refusjonId}`);
    return response.data;
};

export const useHentRefusjoner = (bedriftnummer: string, status?: Status, tiltakstype?: Tiltak) => {
    const { data } = useSWR<Refusjon[]>(
        `/refusjon?bedriftNr=${bedriftnummer}&status=${status || ''}&tiltakstype=${tiltakstype || ''}`,
        swrConfig
    );
    return data!;
};

export const useHentRefusjon = (refusjonId: string) => {
    const { data } = useSWR<Refusjon>(`/refusjon/${refusjonId}`, swrConfig);
    return data!;
};

export const useHentTidligereRefusjoner = (refusjonId: string) => {
    const { data } = useSWR<Refusjon[]>(`/refusjon/${refusjonId}/tidligere-refusjoner`, swrConfig);
    return data!;
};
