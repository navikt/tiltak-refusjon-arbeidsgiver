export type Feilkode =
    | 'UGYLDIG_STATUS'
    | 'INGEN_INNTEKTER'
    | 'TEKNISK_FEIL_BANKKONTONUMMEROPPSLAG'
    | 'INGEN_BEDRIFTKONTONUMMER';

export const Feilmeldinger: { [key in Feilkode]: string } = {
    INGEN_BEDRIFTKONTONUMMER: 'Mangler kontonummer for bedriften',
    INGEN_INNTEKTER: 'Ingen inntekter for perioden ble funnet',
    TEKNISK_FEIL_BANKKONTONUMMEROPPSLAG: 'Feil ved henting av bankkontonummer',
    UGYLDIG_STATUS: 'Handlingen kan ikke utføres fordi refusjonen har ugyldig status.',
};
