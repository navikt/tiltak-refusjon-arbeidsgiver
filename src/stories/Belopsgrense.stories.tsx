import Utregning from '@/komponenter/Utregning';
import { Refusjonsgrunnlag } from '@/refusjon/refusjon';
import { Tiltak } from '@/refusjon/tiltak';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Utregning',
    args: {},
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const refusjondata: Refusjonsgrunnlag & { refusjonsnummer: { avtalenr: number; løpenummer: number } } = {
    refusjonsnummer: {
        avtalenr: 1234,
        løpenummer: 2,
    },
    forrigeRefusjonMinusBeløp: 0,
    beregning: {
        lønn: 42846,
        lønnFratrukketFerie: 42846,
        feriepenger: 5142,
        tjenestepensjon: 960,
        arbeidsgiveravgift: 6902,
        sumUtgifter: 55849,
        beregnetBeløp: 22340,
        refusjonsbeløp: 20579,
        overTilskuddsbeløp: true,
        tidligereUtbetalt: 0,
        fratrekkLønnFerie: 0,
        tidligereRefundertBeløp: 0,
        sumUtgifterFratrukketRefundertBeløp: 55849,
        overFemGrunnbeløp: false,
        id: '01HKMQGE6YT917YK9YMEHD2SGF',
    },
    tilskuddsgrunnlag: {
        avtaleId: 'f2cd0387-b5ca-49f8-aa4e-d77b25ccb9a1',
        avtaleFom: undefined,
        avtaleTom: undefined,
        tilskuddsperiodeId: '75b2fdf6-1657-4288-acc5-927fe63d00a0',
        deltakerFornavn: 'Bjørnstjerne',
        deltakerEtternavn: 'Bjørnson',
        deltakerFnr: '28128521498',
        arbeidsgiverFornavn: 'Arne',
        arbeidsgiverEtternavn: 'Arbeidsgiver',
        arbeidsgiverTlf: '41111111',
        veilederNavIdent: 'X123456',
        bedriftNavn: 'Kiwi Majorstuen',
        bedriftNr: '999999999',
        tilskuddFom: '2023-12-01',
        tilskuddTom: '2023-12-31',
        feriepengerSats: 0.12,
        otpSats: 0.02,
        arbeidsgiveravgiftSats: 0.141,
        tiltakstype: Tiltak.SOMMERJOBB,
        tilskuddsbeløp: 20579,
        lønnstilskuddsprosent: 40,
        avtaleNr: 3456,
        løpenummer: 3,
        enhet: '1000',
        id: '01HKM5N9FB3VAVBBE7APWJZKP7',
    },
    inntektsgrunnlag: {
        inntekter: [
            {
                inntektType: 'LOENNSINNTEKT',
                beskrivelse: 'loennUtbetaltAvVeldedigEllerAllmennyttigInstitusjonEllerOrganisasjon',
                beløp: 423,
                måned: '2023-12',
                opptjeningsperiodeFom: '2023-12-01',
                opptjeningsperiodeTom: '2023-12-31',
                erOpptjentIPeriode: true,
                id: '01HKMQG513NDSB17TCDACXQN74',
                erMedIInntektsgrunnlag: true,
            },
            {
                inntektType: 'LOENNSINNTEKT',
                beskrivelse: 'fastloenn',
                beløp: 10000,
                måned: '2024-01',
                opptjeningsperiodeFom: '2024-01-01',
                opptjeningsperiodeTom: '2024-01-31',
                erOpptjentIPeriode: true,
                id: '01HKMQG513ZQMJ4S12JVK01AM0',
                erMedIInntektsgrunnlag: true,
            },
            {
                inntektType: 'LOENNSINNTEKT',
                beskrivelse: 'trekkILoennForFerie',
                beløp: -1200,
                måned: '2024-01',
                opptjeningsperiodeFom: '2024-01-01',
                opptjeningsperiodeTom: '2024-01-31',
                erOpptjentIPeriode: false,
                id: '01HKMQG5134W50571FPHHCZ4YC',
                erMedIInntektsgrunnlag: false,
            },
            {
                inntektType: 'LOENNSINNTEKT',
                beskrivelse: 'uregelmessigeTilleggKnyttetTilArbeidetTid',
                beløp: 10000,
                måned: '2023-12',
                opptjeningsperiodeFom: '2023-12-01',
                opptjeningsperiodeTom: '2023-12-31',
                erOpptjentIPeriode: true,
                id: '01HKMQG513QPSY3GQBJPFJ8M8Y',
                erMedIInntektsgrunnlag: true,
            },
            {
                inntektType: 'LOENNSINNTEKT',
                beskrivelse: 'trekkILoennForFerie',
                beløp: -1200,
                måned: '2023-12',
                opptjeningsperiodeFom: '2023-12-01',
                opptjeningsperiodeTom: '2023-12-31',
                erOpptjentIPeriode: false,
                id: '01HKMQG513YPFJMB421SPW914Q',
                erMedIInntektsgrunnlag: false,
            },
            {
                inntektType: 'LOENNSINNTEKT',
                beskrivelse: 'fastloenn',
                beløp: 10000,
                måned: '2023-12',
                opptjeningsperiodeFom: '2023-12-01',
                opptjeningsperiodeTom: '2023-12-31',
                erOpptjentIPeriode: true,
                id: '01HKMQG5132FS81CEQHJCF4VBB',
                erMedIInntektsgrunnlag: true,
            },
            {
                inntektType: 'LOENNSINNTEKT',
                beskrivelse: 'fastloenn',
                beløp: 2000,
                måned: '2023-12',
                opptjeningsperiodeFom: '2023-12-01',
                opptjeningsperiodeTom: '2023-12-31',
                erOpptjentIPeriode: true,
                id: '01HKMQG513107EWCF125EASS2G',
                erMedIInntektsgrunnlag: true,
            },
            {
                inntektType: 'LOENNSINNTEKT',
                beskrivelse: 'loennUtbetaltAvVeldedigEllerAllmennyttigInstitusjonEllerOrganisasjon',
                beløp: 423,
                måned: '2024-01',
                opptjeningsperiodeFom: '2024-01-01',
                opptjeningsperiodeTom: '2024-01-31',
                erOpptjentIPeriode: true,
                id: '01HKMQG513JYKQVXCMDXPQNE59',
                erMedIInntektsgrunnlag: true,
            },
            {
                inntektType: 'LOENNSINNTEKT',
                beskrivelse: 'uregelmessigeTilleggKnyttetTilArbeidetTid',
                beløp: 10000,
                måned: '2024-01',
                opptjeningsperiodeFom: '2024-01-01',
                opptjeningsperiodeTom: '2024-01-31',
                erOpptjentIPeriode: true,
                id: '01HKMQG513JEGW1AMZSRDEN9S7',
                erMedIInntektsgrunnlag: true,
            },
        ],
        bruttoLønn: 42846,
        innhentetTidspunkt: '2024-01-08T15:26:50.019561',
    },
};

export const Belopsgrense: Story = {
    name: 'Lønn overskrider tilskuddsbeløp',
    args: {},
    render: (args) => (
        <div>
            <h1>Arbeidsgiver har oppgitt for høy lønn</h1>
            I denne refusjonen har arbeidsgiver valgt så mange inntektslinjer at de overskrider tilskuddsbeløpet. Dermed
            blir beregnet beløp nedjustert.
            <Utregning {...refusjondata} />
        </div>
    ),
};
