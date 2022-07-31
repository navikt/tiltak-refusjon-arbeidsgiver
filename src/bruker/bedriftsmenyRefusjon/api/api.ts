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
    FIFTEEN = 15,
}

export interface Organisasjon {
    Name: string;
    Type: string;
    OrganizationNumber: string;
    OrganizationForm: string;
    Status: string;
    ParentOrganizationNumber: string;
}

export interface OrganisasjonEnhet {
    JuridiskEnhet: Organisasjon;
    Underenheter: Array<Organisasjon>;
}

type OrgList = Array<OrganisasjonEnhet>;

export interface Organisasjonlist {
    list: OrgList;
    feilstatus: StatusFeilBedriftmeny[] | undefined;
}

export enum Feilstatus {
    GREIDE_IKKE_BYGGE_ORGTRE = 'GREIDE_IKKE_BYGGE_ORGTRE',
    JURIDISK_MANGLER_UNDERENHET = 'JURIDISK_MANGLER_UNDERENHET',
    UNDERENHET_MANGLET_JURIDISK = 'UNDERENHET_MANGLET_JURIDISK',
}

export enum FeilNivå {
    ERROR = 'ERROR',
    WARNING = 'WARNING',
}

export interface StatusFeilBedriftmeny {
    status: Feilstatus;
    gjeldeneOrg: Array<Organisasjon> | undefined;
    nivå: FeilNivå;
}

export enum BedriftvalgType {
    ENKELBEDRIFT = 'ENKELBEDRIFT',
    FLEREBEDRIFTER = 'FLEREBEDRIFTER',
    ALLEBEDRIFTER = 'ALLEBEDRIFTER',
}

interface IndexObjectOfBedriftvalg {
    [key: string]: any;
}

export interface Bedriftvalg extends IndexObjectOfBedriftvalg {
    type: BedriftvalgType;
    valgtOrg: Array<Organisasjon>;
    pageData: PageData;
    feilstatus: StatusFeilBedriftmeny[] | undefined;
}

export interface Sokefelt {
    aktivt: boolean;
    antallTreff: number;
    organisasjonstreTreff: Array<OrganisasjonEnhet> | undefined;
}

export type BedriftListe = Array<{ index: number; apnet: boolean }> | undefined;

export interface MenyContextType {
    valgtBedrift: Bedriftvalg | undefined;
    setValgtBedrift: (org: Bedriftvalg) => void;
    organisasjoner: Organisasjon[];
    history: History;
    organisasjonstre: Organisasjonlist | undefined;
    setOrganisasjonstre: Dispatch<SetStateAction<Organisasjonlist | undefined>>;
    menyApen: boolean;
    setMenyApen: Dispatch<SetStateAction<boolean>>;
    bedriftvalg: Bedriftvalg;
    setBedriftvalg: Dispatch<SetStateAction<Bedriftvalg>>;
    bedriftListe: BedriftListe;
    setBedriftListe: Dispatch<SetStateAction<BedriftListe>>;
    desktopview: boolean;
    sokefelt: Sokefelt;
    setSokefelt: Dispatch<SetStateAction<Sokefelt>>;
    callbackAlleClick: boolean;
}

export const initPageData: PageData = {
    page: 0,
    pagesize: 10,
    currentPage: 0,
    size: 0,
    totalItems: 0,
    totalPages: 0,
};

export const initvalgtBedrift: Bedriftvalg = {
    type: BedriftvalgType.ALLEBEDRIFTER,
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

export const initBedriftvalg: Bedriftvalg = {
    ...initvalgtBedrift,
    valgtOrg: [{ ...initOrganisasjon, OrganizationNumber: '999999999' }],
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
                href: '',
            },
        },
    },
    hjemmeside: '',
    postadresse: {
        land: 'Norge',
        landkode: 'NO',
        postnummer: '',
        poststed: '',
        adresse: [''],
        kommune: '',
        kommunenummer: '',
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
        postnummer: '',
        poststed: '',
        adresse: [''],
        kommune: '',
        kommunenummer: '',
    },
    institusjonellSektorkode: {
        kode: '6500',
        beskrivelse: '',
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
            href: '',
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
