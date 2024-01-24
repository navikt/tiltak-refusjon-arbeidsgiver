import React, { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction } from 'react';
import GodkjennModal from './GodkjennModal';
import { BodyShort } from '@navikt/ds-react';
import { formatterPeriode } from '../../utils/datoUtils';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjon } from '../refusjon';

interface Properties {
    refusjon: Refusjon;
    visGodkjennModal: boolean;
    setVisGodkjennModal: Dispatch<SetStateAction<boolean>>;
    godkjennRefusjonen: () => Promise<void>;
}

const RefusjonGodkjennModal: FunctionComponent<Properties> = ({
    refusjon,
    visGodkjennModal,
    setVisGodkjennModal,
    godkjennRefusjonen,
}: PropsWithChildren<Properties>) => {
    const { tilskuddsgrunnlag, beregning } = refusjon.refusjonsgrunnlag;
    if (beregning?.refusjonsbeløp! > 0) {
        return (
            <GodkjennModal
                isOpen={visGodkjennModal}
                lukkModal={() => setVisGodkjennModal(false)}
                godkjenn={godkjennRefusjonen}
                tittel="Send inn refusjon"
            >
                <BodyShort size="small">
                    Du søker nå om refusjon for hele den avtalte perioden{' '}
                    <b>
                        {formatterPeriode(tilskuddsgrunnlag.tilskuddFom, tilskuddsgrunnlag.tilskuddTom)}. Dette kan du
                        kun gjøre en gang.
                    </b>{' '}
                    Sikre deg derfor at alle inntekter innenfor perioden er rapportert inn og at refusjonsbeløpet
                    stemmer.
                </BodyShort>
                <VerticalSpacer rem={1} />
                <BodyShort size="small">
                    Hvis refusjonsbeløpet på <b>{formatterPenger(beregning?.refusjonsbeløp!)}</b> ikke stemmer, ta
                    kontakt med veileder før du klikker Send inn.
                </BodyShort>
            </GodkjennModal>
        );
    } else {
        return (
            <GodkjennModal
                isOpen={visGodkjennModal}
                lukkModal={() => setVisGodkjennModal(false)}
                godkjenn={godkjennRefusjonen}
                tittel="Godta beløp"
            >
                <BodyShort size="small">
                    Du godtar nå beløpet for den avtalte perioden{' '}
                    <b>
                        {formatterPeriode(tilskuddsgrunnlag.tilskuddFom, tilskuddsgrunnlag.tilskuddTom)}. Dette kan du
                        kun gjøre en gang.
                    </b>{' '}
                    Sikre deg derfor at alle inntekter innenfor perioden er rapportert inn og at beløpet stemmer.
                </BodyShort>
                <VerticalSpacer rem={1} />
                <BodyShort size="small">
                    Hvis beløpet på <b>{formatterPenger(beregning?.refusjonsbeløp!)}</b> ikke stemmer, ta kontakt med
                    veileder før du klikker Send inn.
                </BodyShort>
            </GodkjennModal>
        );
    }
};
export default RefusjonGodkjennModal;
