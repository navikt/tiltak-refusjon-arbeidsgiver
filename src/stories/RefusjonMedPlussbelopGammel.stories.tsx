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

const refusjonPlussbelop: Refusjon = {
    refusjonsgrunnlag: {
        tilskuddsgrunnlag: {
            avtaleId: 'a2d4b23d-91f3-4384-b9e7-b2455586fbe3',
            avtaleFom: undefined,
            avtaleTom: undefined,
            tilskuddsperiodeId: '0cd44add-7a3a-4384-b608-6417dc87dcb5',
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
            tiltakstype: Tiltak.MIDLERTIDIG_LØNNSTILSKUDD,
            tilskuddsbeløp: 20579,
            lønnstilskuddsprosent: 40,
            avtaleNr: 3456,
            løpenummer: 3,
            enhet: '1000',
            id: '01HMGY26W4BD9WA745B6541NWQ',
        },
        inntektsgrunnlag: {
            inntekter: [
                {
                    inntektType: 'LOENNSINNTEKT',
                    beskrivelse: 'trekkILoennForFerie',
                    beløp: -1200.0,
                    måned: '2023-12',
                    opptjeningsperiodeFom: '2023-12-01',
                    opptjeningsperiodeTom: '2023-12-31',
                    erOpptjentIPeriode: undefined,
                    id: '01HMGY3BT6GVNPND3TGG2H7940',
                    erMedIInntektsgrunnlag: false,
                },
                {
                    inntektType: 'LOENNSINNTEKT',
                    beskrivelse: 'fastloenn',
                    beløp: 10000.0,
                    måned: '2023-12',
                    opptjeningsperiodeFom: '2023-12-01',
                    opptjeningsperiodeTom: '2023-12-31',
                    erOpptjentIPeriode: undefined,
                    id: '01HMGY3BT6YYAM7SWMRYE7EQZK',
                    erMedIInntektsgrunnlag: true,
                },
                {
                    inntektType: 'LOENNSINNTEKT',
                    beskrivelse: 'fastloenn',
                    beløp: 2000.0,
                    måned: '2023-12',
                    opptjeningsperiodeFom: '2023-12-01',
                    opptjeningsperiodeTom: '2023-12-31',
                    erOpptjentIPeriode: null,
                    id: '01HMGY3BT66V3X4F5RCZSGTCBW',
                    erMedIInntektsgrunnlag: true,
                },
                {
                    inntektType: 'LOENNSINNTEKT',
                    beskrivelse: 'loennUtbetaltAvVeldedigEllerAllmennyttigInstitusjonEllerOrganisasjon',
                    beløp: 423.0,
                    måned: '2023-12',
                    opptjeningsperiodeFom: '2023-12-01',
                    opptjeningsperiodeTom: '2023-12-31',
                    erOpptjentIPeriode: null,
                    id: '01HMGY3BT630AZMZBJF8QJNT9A',
                    erMedIInntektsgrunnlag: true,
                },
                {
                    inntektType: 'LOENNSINNTEKT',
                    beskrivelse: 'uregelmessigeTilleggKnyttetTilArbeidetTid',
                    beløp: 10000.0,
                    måned: '2023-12',
                    opptjeningsperiodeFom: '2023-12-01',
                    opptjeningsperiodeTom: '2023-12-31',
                    erOpptjentIPeriode: null,
                    id: '01HMGY3BT6CBVMSKM76J15JGQJ',
                    erMedIInntektsgrunnlag: true,
                },
            ],
            bruttoLønn: 22423.0,
            innhentetTidspunkt: '2024-01-19T14:20:55.110261',
        },
        bedriftKontonummer: '10000008145',
        bedriftKid: undefined,
        inntekterKunFraTiltaket: true,
        endretBruttoLønn: undefined,
        fratrekkRefunderbarBeløp: false,
        refunderbarBeløp: undefined,
        forrigeRefusjonMinusBeløp: 0,
        beregning: {
            lønn: 12000,
            lønnFratrukketFerie: 10800,
            feriepenger: 1296,
            tjenestepensjon: 242,
            arbeidsgiveravgift: 1740,
            sumUtgifter: 14078,
            beregnetBeløp: 5631,
            refusjonsbeløp: 5631,
            overTilskuddsbeløp: false,
            tidligereUtbetalt: 0,
            fratrekkLønnFerie: -1200,
            tidligereRefundertBeløp: 0,
            sumUtgifterFratrukketRefundertBeløp: 14078,
            overFemGrunnbeløp: false,
            id: '01HMGY3Q0VWAMGBX1VVZSCN93P',
        },
    },
    bedriftNr: '999999999',
    deltakerFnr: '28128521498',
    id: '01HMGY26W4BXX44P6EAJNEN21E',
    fristForGodkjenning: '2024-02-29',
    forrigeFristForGodkjenning: undefined,
    unntakOmInntekterFremitid: 0,
    hentInntekterLengerFrem: 'foobar',
    godkjentAvArbeidsgiver: '2024-01-19T13:21:10.828078Z',
    status: RefusjonStatus.SENDT_KRAV,
    korreksjonId: undefined,
    utbetaltTidspunkt: undefined,
    åpnetFørsteGang: '2024-01-19T13:20:55.109605Z',
    sistEndret: '2024-01-19T13:21:06.588565Z',
    harTattStillingTilAlleInntektslinjer: true,
};

export const RefusjonPlussbelopGammel: Story = {
    name: 'Refusjon med plussbeløp (gammel visning)',
    args: { refusjon: refusjonPlussbelop },
    decorators: [
        (Story, args) => (
            <div>
                <h1>KvitteringSide: Refusjon med plussbeløp (gammel visning)</h1>
                <p>
                    Før i tiden kunne man ikke velge om en inntektslinje var opptjent i perioden, og da hadde vi en
                    annen visning av inntekter
                </p>
                <Story {...args} />
            </div>
        ),
    ],
};
