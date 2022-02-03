import { Organisasjon } from '@navikt/bedriftsmeny/lib/organisasjon';
import { Bedriftvalg } from './bedriftsmenyRefusjon/api/organisasjon';

export type Bedrift = string;

export type Bedriftliste = Array<Bedrift> | undefined;

export interface BrukerContextType {
    innloggetBruker: InnloggetBruker;
    valgtBedrift: Bedriftvalg;
    page: number;
    pagesize: number;
}

export interface InnloggetBruker {
    identifikator: string;
    organisasjoner: Organisasjon[];
    tilganger: Bedrift[];
}
