import { Organisasjon } from '@navikt/bedriftsmeny/lib/organisasjon';
import { Dispatch, SetStateAction } from 'react';
import { Juridiskenhet } from './bedriftsmenyRefusjon/organisasjon';
import { History } from 'history';

export type Bedrift = string;

export interface BrukerContextType {
    innloggetBruker: InnloggetBruker;
    valgtBedrift: Bedrift;
}

export interface MenyContextType {
    valgtBedrift: Bedrift | undefined;
    setValgtBedrift: (org: Organisasjon) => void;
    organisasjoner: Organisasjon[];
    history: History;
    organisasjonstre: Juridiskenhet[] | undefined;
    menyApen: boolean;
    setMenyApen: Dispatch<SetStateAction<boolean>>;
}

export interface InnloggetBruker {
    identifikator: string;
    organisasjoner: Organisasjon[];
    tilganger: Bedrift[];
}
