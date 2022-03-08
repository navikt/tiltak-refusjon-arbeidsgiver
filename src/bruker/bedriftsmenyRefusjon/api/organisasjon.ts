import { History } from 'history';
import { Dispatch, SetStateAction } from 'react';

export enum ClsBedriftsmeny {
    BEDRIFTSMENY_REFUSJON = 'bedriftsmeny-refusjon',
    BEDRIFTSMENY = 'bedriftsmenyen',
    MENYINNHOLD = 'menyInnhold',
    SOK_ETTER_BEDRIFTER = 'sok-etter-bedrifter',
}

export enum PageSizeOption {
    FIVE = 5,
    SEVEN = 7,
    TEN = 10,
}

export interface Organisasjon {
    Name: string;
    Type: string;
    OrganizationNumber: string;
    OrganizationForm: string;
    Status: string;
    ParentOrganizationNumber: string;
}

export interface Juridiskenhet {
    JuridiskEnhet: Organisasjon;
    Underenheter: Array<Organisasjon>;
    SokeresultatKunUnderenhet?: boolean;
}

export enum Feilstatus {
    JURIDISK_MANGLER_UNDERENHET = 'JURIDISK_MANGLER_UNDERENHET',
    UNDERENHET_MANGLET_JURIDISK = '',
}

export enum BedriftvalgType {
    ENKELBEDRIFT = 'ENKELBEDRIFT',
    FLEREBEDRIFTER = 'FLEREBEDRIFTER',
    ALLEBEDRIFTER = 'ALLEBEDRIFTER',
}

export interface Bedriftvalg {
    type: BedriftvalgType;
    valgtOrg: Array<Organisasjon>;
    pageData: PageData;
    feilstatus: Feilstatus | undefined;
}

export type BedriftListe = Array<{ index: number; apnet: boolean }> | undefined;

export interface MenyContextType {
    valgtBedrift: Bedriftvalg | undefined;
    setValgtBedrift: (org: Bedriftvalg) => void;
    organisasjoner: Organisasjon[];
    history: History;
    organisasjonstre: Array<Juridiskenhet> | undefined;
    setOrganisasjonstre: Dispatch<SetStateAction<Array<Juridiskenhet> | undefined>>;
    menyApen: boolean;
    setMenyApen: Dispatch<SetStateAction<boolean>>;
    bedriftvalg: Bedriftvalg;
    setBedriftvalg: Dispatch<SetStateAction<Bedriftvalg>>;
    bedriftListe: BedriftListe;
    setBedriftListe: Dispatch<SetStateAction<BedriftListe>>;
    desktopview: boolean;
}

export const initPageData: PageData = {
    page: 0,
    pagesize: 7,
    currentPage: 0,
    size: 0,
    totalItems: 0,
    totalPages: 0,
};

export const initBedriftvalg: Bedriftvalg = {
    type: BedriftvalgType.ENKELBEDRIFT,
    valgtOrg: [] as Array<Organisasjon>,
    pageData: initPageData,
    feilstatus: undefined,
};

export interface PageData {
    page: number;
    pagesize: number;
    currentPage: number;
    size: number;
    totalItems: number;
    totalPages: number;
}
export const initOrganisasjon: Organisasjon = {
    Name: '',
    Type: '',
    OrganizationNumber: '',
    OrganizationForm: '',
    Status: '',
    ParentOrganizationNumber: '',
};

export interface OrganisasjonEnhetsregisteret {
    organisasjonsnummer: string;
    navn: string;
    organisasjonsform: {
        kode: string;
        beskrivelse: string;
        _links: {
            self: {
                href: string;
            };
        };
    };
    hjemmeside: string;
    postadresse: {
        land: string;
        landkode: string;
        postnummer: string;
        poststed: string;
        adresse: string[];
        kommune: string;
        kommunenummer: string;
    };
    registreringsdatoEnhetsregisteret: string;
    registrertIMvaregisteret: boolean;
    naeringskode1: {
        beskrivelse: string;
        kode: string;
    };
    antallAnsatte: number;
    forretningsadresse: {
        land: string;
        landkode: string;
        postnummer: string;
        poststed: string;
        adresse: string[];
        kommune: string;
        kommunenummer: string;
    };
    institusjonellSektorkode: {
        kode: string;
        beskrivelse: string;
    };
    registrertIForetaksregisteret: boolean;
    registrertIStiftelsesregisteret: boolean;
    registrertIFrivillighetsregisteret: boolean;
    konkurs: boolean;
    underAvvikling: boolean;
    underTvangsavviklingEllerTvangsopplosning: boolean;
    maalform: string;
    _links: {
        self: {
            href: string;
        };
    };
}

export const initEnhetsregOrg: OrganisasjonEnhetsregisteret = {
    organisasjonsnummer: '',
    navn: '',
    organisasjonsform: {
        kode: 'KOMM',
        beskrivelse: 'Kommune',
        _links: {
            self: {
                href: 'https://data.brreg.no/enhetsregisteret/api/organisasjonsformer/KOMM',
            },
        },
    },
    hjemmeside: 'www.gjovik.kommune.no/',
    postadresse: {
        land: 'Norge',
        landkode: 'NO',
        postnummer: '2810',
        poststed: 'GJØVIK',
        adresse: ['Postboks 630'],
        kommune: 'GJØVIK',
        kommunenummer: '3407',
    },
    registreringsdatoEnhetsregisteret: '1995-06-07',
    registrertIMvaregisteret: true,
    naeringskode1: {
        beskrivelse: 'Generell offentlig administrasjon',
        kode: '84.110',
    },
    antallAnsatte: 4571,
    forretningsadresse: {
        land: 'Norge',
        landkode: 'NO',
        postnummer: '2815',
        poststed: 'GJØVIK',
        adresse: ['Kauffeldts plass 1'],
        kommune: 'GJØVIK',
        kommunenummer: '3407',
    },
    institusjonellSektorkode: {
        kode: '6500',
        beskrivelse: 'Kommuneforvaltningen',
    },
    registrertIForetaksregisteret: false,
    registrertIStiftelsesregisteret: false,
    registrertIFrivillighetsregisteret: false,
    konkurs: false,
    underAvvikling: false,
    underTvangsavviklingEllerTvangsopplosning: false,
    maalform: 'Bokmål',
    _links: {
        self: {
            href: 'https://data.brreg.no/enhetsregisteret/api/enheter/940155223',
        },
    },
};

export interface ListeJuridiskeEnheter {
    _embedded: {
        enheter: OrganisasjonEnhetsregisteret[];
    };
    _links: {
        self: {
            href: string;
        };
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: 0;
    };
}
