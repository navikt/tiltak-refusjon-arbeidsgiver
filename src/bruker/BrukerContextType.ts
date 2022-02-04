import { Organisasjon } from '@navikt/bedriftsmeny/lib/organisasjon';
import { Bedriftvalg } from './bedriftsmenyRefusjon/api/organisasjon';
import { Dispatch, SetStateAction } from 'react';

export type Bedrift = string;

export type Bedriftliste = Array<Bedrift> | undefined;

export type SettPageData = Dispatch<SetStateAction<PageData>>;

export interface BrukerContextType {
    innloggetBruker: InnloggetBruker;
    valgtBedrift: Bedriftvalg;
    pageData: PageData;
    setPageData: SettPageData;
}

export interface PageData {
    page: number;
    pagesize: number;
    currentPage: number;
    size: number;
    totalItems: number;
    totalPages: number;
}

export interface InnloggetBruker {
    identifikator: string;
    organisasjoner: Organisasjon[];
    tilganger: Bedrift[];
}
