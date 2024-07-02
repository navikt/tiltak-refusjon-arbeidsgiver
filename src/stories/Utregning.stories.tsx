import type { Meta, StoryObj } from '@storybook/react';
import Utregning from '@/komponenter/Utregning';
import { Tiltak } from '@/refusjon/tiltak';
import { Refusjonsgrunnlag } from '@/refusjon/refusjon';

const meta = {
    title: 'Utregning',
    component: Utregning,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Utregning>;

export default meta;
type Story = StoryObj<typeof meta>;

const fratrekkData = {
    refusjonsnummer: {
        avtalenr: 1234,
        løpenummer: 2,
    },
    erKorreksjon: false,
    forrigeRefusjonMinusBeløp: -6558,
    beregning: {
        lønn: 108115,
        lønnFratrukketFerie: 108115,
        feriepenger: 12974,
        tjenestepensjon: 2422,
        arbeidsgiveravgift: 17415,
        sumUtgifter: 140926,
        beregnetBeløp: 56370,
        refusjonsbeløp: 14021,
        overTilskuddsbeløp: true,
        overFemGrunnbeløp: false,
        tidligereUtbetalt: 0,
        fratrekkLønnFerie: 0,
        tidligereRefundertBeløp: 0,
        sumUtgifterFratrukketRefundertBeløp: 140926,
        id: '01HKM6MGVB5ENFQRXTSSFAJN8C',
    },
    tilskuddsgrunnlag: {
        avtaleId: 'c2c91ca9-675a-464c-835a-5e6e7aaa2f0b',
        tilskuddsperiodeId: '260cc056-da57-4e53-9065-6c717897dc9f',
        deltakerFornavn: 'Bjørnstjerne',
        deltakerEtternavn: 'Bjørnson',
        deltakerFnr: '28128521498',
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
        arbeidsgiverFornavn: 'Arbeidsgiver',
        arbeidsgiverEtternavn: 'Arbeidsgiversen',
        arbeidsgiverTlf: '12345678',
        id: '01HKM5N9F88835R2DSANTK3WPN',
    },
    inntektsgrunnlag: {
        inntekter: [],
        bruttoLønn: 108115,
        innhentetTidspunkt: '2024-01-08T10:31:43.265423',
    },
};

export const OppgjortMinusbeløp: Story = {
    name: 'Oppgjort minusbeløp',
    args: fratrekkData,
    decorators: [
        (Story, args) => (
            <div>
                <h1>Refusjon: Oppgjort minusbeløp, og over maks tilskudd</h1>
                <p>
                    Her har et ferietrekk ført til at en tidligere refusjon har gått i minus (arbeidsgiver er derfor
                    skyldig penger). Da må det beløpet trekkes fra i oppgjøret.
                </p>
                <p>Arbeidsgiver har også markert lønn som overstiger det avtalte tilskuddsbeløpet.</p>
                <Story {...args} />
            </div>
        ),
    ],
};

const refusjondata: Refusjonsgrunnlag & {
    refusjonsnummer: { avtalenr: number; løpenummer: number };
    erKorreksjon: boolean;
} = {
    refusjonsnummer: {
        avtalenr: 1234,
        løpenummer: 2,
    },
    erKorreksjon: false,
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
    args: refusjondata,
    render: (args) => (
        <div>
            <h1>Arbeidsgiver har oppgitt for høy lønn</h1>
            I denne refusjonen har arbeidsgiver valgt så mange inntektslinjer at de overskrider tilskuddsbeløpet. Dermed
            blir beregnet beløp nedjustert.
            <Utregning {...refusjondata} />
        </div>
    ),
};

const refusjondata5G: Refusjonsgrunnlag & {
    refusjonsnummer: { avtalenr: number; løpenummer: number };
    erKorreksjon: boolean;
} = {
    refusjonsnummer: {
        avtalenr: 1234,
        løpenummer: 2,
    },
    erKorreksjon: false,
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
        overTilskuddsbeløp: false,
        tidligereUtbetalt: 0,
        fratrekkLønnFerie: 0,
        tidligereRefundertBeløp: 0,
        sumUtgifterFratrukketRefundertBeløp: 55849,
        overFemGrunnbeløp: true,
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

export const Belopsgrense5G: Story = {
    name: 'Lønn overskrider 5G',
    args: refusjondata5G,
};
