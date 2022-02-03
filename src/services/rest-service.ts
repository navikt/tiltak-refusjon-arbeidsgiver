import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { BrukerContextType, InnloggetBruker } from '../bruker/BrukerContextType';
import { Korreksjon, Refusjon } from '../refusjon/refusjon';
import { RefusjonStatus } from '../refusjon/status';
import { Tiltak } from '../refusjon/tiltak';
import { BedriftvalgType } from '../bruker/bedriftsmenyRefusjon/api/organisasjon';

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

export const useHentRefusjoner = (
    brukerContext: BrukerContextType,
    status?: RefusjonStatus,
    tiltakstype?: Tiltak
): Refusjon[] => {
    const { valgtBedrift, page, pagesize } = brukerContext;
    switch (brukerContext.valgtBedrift.type) {
        case BedriftvalgType.ENKELBEDRIFT:
            return HentRefusjonerForEnkeltOrganisasjon(
                valgtBedrift.valgtOrg?.[0]?.OrganizationNumber,
                status,
                tiltakstype
            );
        case BedriftvalgType.FLEREBEDRIFTER:
            return HentRefusjonForMangeOrganisasjoner(
                valgtBedrift.valgtOrg.map((e) => e.OrganizationNumber).join(','),
                page,
                pagesize,
                status,
                tiltakstype
            );
        case BedriftvalgType.ALLEBEDRIFTER:
            return HentRefusjonForMangeOrganisasjoner(
                BedriftvalgType.ALLEBEDRIFTER,
                page,
                pagesize,
                status,
                tiltakstype
            );
    }
};

export const HentRefusjonerForEnkeltOrganisasjon = (
    bedriftnummer: string,
    status?: RefusjonStatus,
    tiltakstype?: Tiltak
): Refusjon[] => {
    const { data } = useSWR<Refusjon[]>(
        `/refusjon?bedriftNr=${bedriftnummer}&status=${status || ''}&tiltakstype=${tiltakstype || ''}`,
        swrConfig
    );
    return data!;
};

export const HentRefusjonForMangeOrganisasjoner = (
    bedriftlist: string,
    page: number,
    pagesize: number,
    status?: RefusjonStatus,
    tiltakstype?: Tiltak
): Refusjon[] => {
    const { data } = useSWR<Refusjon[]>(
        `/refusjon/hentliste?bedriftNr=${bedriftlist}&page=${page}&size=${pagesize}&&status=${
            status || ''
        }&tiltakstype=${tiltakstype || ''}`,
        swrConfig
    );
    console.log('data: ', data);
    return data!;
};

export const useHentRefusjon = (refusjonId?: string) => {
    const parameter = refusjonId ? `/refusjon/${refusjonId}` : null;
    const { data } = useSWR<Refusjon>(parameter, swrConfig);
    return data!;
};

export const useHentTidligereRefusjoner = (refusjonId: string) => {
    const { data } = useSWR<Refusjon[]>(`/refusjon/${refusjonId}/tidligere-refusjoner`, swrConfig);
    return data!;
};

export const useHentKorreksjon = (korreksjonId: string) => {
    const { data } = useSWR<Korreksjon>(`/korreksjon/${korreksjonId}`, swrConfig);
    return data!;
};
