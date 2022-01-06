import { Organisasjon } from '@navikt/bedriftsmeny/lib/organisasjon';
import { Dispatch } from 'react';
import { Juridiskenhet } from './bedriftsmenyRefusjon/organisasjon';
import { History } from 'history';

export type Bedrift = string;

export interface BrukerContextType {
    innloggetBruker: InnloggetBruker;
    valgtBedrift: Bedrift;
}

export interface MenyContextType {
    valgtBedrift: Bedrift | undefined;
    setValgtBedrift: Dispatch<string>;
    organisasjoner: Organisasjon[];
    history: History;
    organisasjonstre: Juridiskenhet[] | undefined;
}

export interface InnloggetBruker {
    identifikator: string;
    organisasjoner: Organisasjon[];
    tilganger: Bedrift[];
}
