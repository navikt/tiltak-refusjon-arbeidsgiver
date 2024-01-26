import KvitteringSide from '@/refusjon/KvitteringSide/KvitteringSide';
import { Refusjon } from '@/refusjon/refusjon';
import { RefusjonStatus } from '@/refusjon/status';
import { Tiltak } from '@/refusjon/tiltak';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'KvitteringSide',
    component: KvitteringSide,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof KvitteringSide>;

export default meta;
type Story = StoryObj<typeof meta>;

const refusjonMinusbelop: Refusjon = {
    refusjonsgrunnlag: {
        tilskuddsgrunnlag: {
            avtaleId: '88a432cc-8747-40b7-b742-d4c9b25491ec',
            avtaleFom: undefined,
            avtaleTom: undefined,
            tilskuddsperiodeId: 'dda70c79-8d27-4138-84d8-dae29f8b9dc3',
            deltakerFornavn: 'Formye',
            deltakerEtternavn: 'Ferietrekksen',
            deltakerFnr: '28061827902',
            arbeidsgiverFornavn: 'Arne',
            arbeidsgiverEtternavn: 'Arbeidsgiver',
            arbeidsgiverTlf: '41111111',
            veilederNavIdent: 'Z123456',
            bedriftNavn: 'Kiwi Majorstuen',
            bedriftNr: '999999999',
            tilskuddFom: '2023-12-01',
            tilskuddTom: '2023-12-31',
            feriepengerSats: 0.12,
            otpSats: 0.02,
            arbeidsgiveravgiftSats: 0.141,
            tiltakstype: Tiltak.SOMMERJOBB,
            tilskuddsbeløp: 13337,
            lønnstilskuddsprosent: 40,
            avtaleNr: 3456,
            løpenummer: 3,
            enhet: '1000',
            id: '01HMGZ78M9Y1G4DB5MEDCRWEPG',
        },
        inntektsgrunnlag: {
            inntekter: [
                {
                    inntektType: 'LOENNSINNTEKT',
                    beskrivelse: 'fastloenn',
                    beløp: 30000.0,
                    måned: '2023-12',
                    opptjeningsperiodeFom: '2023-12-31',
                    opptjeningsperiodeTom: '2023-12-31',
                    erOpptjentIPeriode: false,
                    id: '01HMGZ7JF5017791FAYSDD9PAA',
                    erMedIInntektsgrunnlag: true,
                },
                {
                    inntektType: 'LOENNSINNTEKT',
                    beskrivelse: 'trekkILoennForFerie',
                    beløp: -35000.0,
                    måned: '2023-12',
                    opptjeningsperiodeFom: '2024-01-31',
                    opptjeningsperiodeTom: '2023-12-31',
                    erOpptjentIPeriode: undefined,
                    id: '01HMGZ7JF02A77ZRT7XMWWJ1KB',
                    erMedIInntektsgrunnlag: false,
                },
                {
                    inntektType: 'LOENNSINNTEKT',
                    beskrivelse: 'fastloenn',
                    beløp: 2000.0,
                    måned: '2023-12',
                    opptjeningsperiodeFom: '2023-12-31',
                    opptjeningsperiodeTom: '2023-12-31',
                    erOpptjentIPeriode: true,
                    id: '01HMGZ7JF5M6XTHZZZ86340TH6',
                    erMedIInntektsgrunnlag: true,
                },
                {
                    inntektType: 'LOENNSINNTEKT',
                    beskrivelse: 'fastloenn',
                    beløp: 30000.0,
                    måned: '2023-12',
                    opptjeningsperiodeFom: '2024-01-31',
                    opptjeningsperiodeTom: '2023-12-31',
                    erOpptjentIPeriode: false,
                    id: '01HMGZ7JF0RTV29JAQFF86YH5H',
                    erMedIInntektsgrunnlag: true,
                },
            ],
            bruttoLønn: 62000.0,
            innhentetTidspunkt: '2024-01-19T14:40:41.573979',
        },
        bedriftKontonummer: '10000008145',
        bedriftKid: undefined,
        inntekterKunFraTiltaket: true,
        endretBruttoLønn: undefined,
        fratrekkRefunderbarBeløp: false,
        refunderbarBeløp: undefined,
        forrigeRefusjonMinusBeløp: 0,
        beregning: {
            lønn: 2000,
            lønnFratrukketFerie: -33000,
            feriepenger: -3960,
            tjenestepensjon: -739,
            arbeidsgiveravgift: -5316,
            sumUtgifter: -43015,
            beregnetBeløp: -17206,
            refusjonsbeløp: -17206,
            overTilskuddsbeløp: false,
            tidligereUtbetalt: 0,
            fratrekkLønnFerie: -35000,
            tidligereRefundertBeløp: 0,
            sumUtgifterFratrukketRefundertBeløp: -43015,
            overFemGrunnbeløp: false,
            id: '01HMGZ7T8YJKQ2YGQKZTPEQ764',
        },
    },
    bedriftNr: '999999999',
    deltakerFnr: '28061827902',
    id: '01HMGZ78M9W9A3CM4SFGHTH3M5',
    fristForGodkjenning: '2024-02-29',
    forrigeFristForGodkjenning: undefined,
    unntakOmInntekterFremitid: 0,
    hentInntekterLengerFrem: 'foobar',
    godkjentAvArbeidsgiver: '2024-01-19T13:40:57.981210Z',
    status: RefusjonStatus.GODKJENT_MINUSBELØP,
    korreksjonId: undefined,
    utbetaltTidspunkt: undefined,
    åpnetFørsteGang: '2024-01-19T13:40:41.566818Z',
    sistEndret: '2024-01-19T13:40:49.567144Z',
    harTattStillingTilAlleInntektslinjer: true,
};

export const RefusjonMinusbelop: Story = {
    name: 'Refusjon med minusbeløp',
    args: { refusjon: refusjonMinusbelop },
    decorators: [
        (Story, args) => (
            <div>
                <h1>KvitteringSide: Refusjon med minusbeløp</h1>
                <Story {...args} />
            </div>
        ),
    ],
};
