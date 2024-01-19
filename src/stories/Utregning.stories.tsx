import type { Meta, StoryObj } from '@storybook/react';
import Utregning from '@/komponenter/Utregning';
import { Tiltak } from '@/refusjon/tiltak';

const meta = {
    title: 'Example/Utregning',
    component: Utregning,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Utregning>;

export default meta;
type Story = StoryObj<typeof meta>;

const fratrekkData = {
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
        overFemGrunnbeløp: true,
        tidligereUtbetalt: 0,
        fratrekkLønnFerie: 0,
        tidligereRefundertBeløp: 0,
        sumUtgifterFratrukketRefundertBeløp: 140926,
        commitHash: '123',
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
