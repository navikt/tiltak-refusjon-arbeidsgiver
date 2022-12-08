import React, { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction } from 'react';
import GodkjennModal from './GodkjennModal';
import { Normaltekst } from 'nav-frontend-typografi';
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

const RefusjonGodjennModal: FunctionComponent<Properties> = ({
    refusjon,
    visGodkjennModal,
    setVisGodkjennModal,
    godkjennRefusjonen,
}: PropsWithChildren<Properties>) => {
    const { tilskuddsgrunnlag, beregning } = refusjon.refusjonsgrunnlag;
    return (
        <GodkjennModal
            isOpen={visGodkjennModal}
            lukkModal={() => setVisGodkjennModal(false)}
            godkjenn={godkjennRefusjonen}
            tittel="Send inn refusjon"
        >
            <Normaltekst>
                Du søker nå om refusjon for hele den avtalte perioden{' '}
                <b>
                    {formatterPeriode(tilskuddsgrunnlag.tilskuddFom, tilskuddsgrunnlag.tilskuddTom)}. Dette kan du kun
                    gjøre en gang.
                </b>{' '}
                Sikre deg derfor at alle inntekter innenfor perioden er rapportert inn og at refusjonsbeløpet stemmer.
            </Normaltekst>
            <VerticalSpacer rem={1} />
            <Normaltekst>
                Hvis refusjonsbeløpet på{' '}
                <b>{formatterPenger(beregning?.refusjonsbeløp! > 0 ? beregning?.refusjonsbeløp! : 0)}</b> ikke stemmer,
                ta kontakt med veileder før du klikker Send inn.
            </Normaltekst>
        </GodkjennModal>
    );
};
export default RefusjonGodjennModal;
