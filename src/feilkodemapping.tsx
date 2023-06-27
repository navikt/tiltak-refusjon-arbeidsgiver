export type Feilkode =
    | 'UGYLDIG_STATUS'
    | 'INGEN_INNTEKTER'
    | 'EREG_MANGLER_ADRESSEINFO'
    | 'EREGOPPSLAG_LITE_INFO'
    | 'TEKNISK_FEIL_EREGOPPSLAG_FANT_IKKE_BEDRIFT'
    | 'TEKNISK_FEIL_EREGOPPSLAG'
    | 'INGEN_BEDRIFTKONTONUMMER'
    | 'GODKJENN_TIDLIGERE_REFUSJON_FØRST'
    | 'REFUSJON_BELOP_NEGATIVT_TALL'
    | 'UGYLDIG_FORLENGELSE_AV_FRIST'
    | 'FEIL_BEDRIFT_KIDNUMMER'
    | 'LAST_REFUSJONEN_PÅ_NYTT_REFUSJONSGRUNNLAG_ENDRET';

export const Feilmeldinger: { [key in Feilkode]: string } = {
    INGEN_BEDRIFTKONTONUMMER: 'Mangler kontonummer for bedriften',
    INGEN_INNTEKTER: 'Ingen inntekter for perioden ble funnet',
    EREG_MANGLER_ADRESSEINFO:
        'Vi kan dessverre ikke betale ut refusjon fordi det mangler en forretningsadresse i Brønnøysundregistrene. Vennligst gå inn på: brreg.no og registrer forretningsadresse så kan du sende refusjon.',
    EREGOPPSLAG_LITE_INFO: 'Mangelful adresse informasjon for bedriften. Vennligst oppdater https://brreg.no',
    TEKNISK_FEIL_EREGOPPSLAG_FANT_IKKE_BEDRIFT: 'Fant ikke bedrift. Vennligst oppdater https://brreg.no',
    TEKNISK_FEIL_EREGOPPSLAG:
        'Feil ved henting av bedriftens adresse. Vennligst se om du har riktig opplysninger på https://brreg.no',
    UGYLDIG_STATUS: 'Handlingen kan ikke utføres fordi refusjonen har ugyldig status.',
    REFUSJON_BELOP_NEGATIVT_TALL: 'Refusjonsbeløpet kan ikke være et negativt tall',
    GODKJENN_TIDLIGERE_REFUSJON_FØRST: 'Du må godkjenne en eldre refusjon, før du sender inn denne.',
    UGYLDIG_FORLENGELSE_AV_FRIST: 'Refusjonen kan ikke lenger forlenges',
    FEIL_BEDRIFT_KIDNUMMER: 'Kan ikke sende inn refusjon med ugyldig KID-nummer',
    LAST_REFUSJONEN_PÅ_NYTT_REFUSJONSGRUNNLAG_ENDRET:
        'Refusjonsgrunnlaget er blitt endret, vennligst last siden på nytt.',
};
