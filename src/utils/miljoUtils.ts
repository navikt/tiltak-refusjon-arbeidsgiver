export const erUtviklingsmiljø = () => process.env.NODE_ENV === 'development';

export const inneholderVertsnavn = (navn: string) => window.location.hostname.includes(navn);

export const inneholderUrlnavn = (navn: string) => window.location.href.includes(navn);
