import React, { FunctionComponent, useContext } from 'react';
import TilbakeTilOversikt from '../../komponenter/TilbakeTilOversikt';
import { formatterDato } from '../../utils/datoUtils';
import KvitteringKorreksjon from '../KvitteringKorreksjon/KvitteringKorreksjon';
import KvitteringSide from '../KvitteringSide/KvitteringSide';
import { RefusjonStatus } from '../status';
import FeilSide from './FeilSide';
import RefusjonSide from './RefusjonSide';
import { RefusjonContext } from '../../RefusjonProvider';

const Komponent: FunctionComponent = () => {
    const { refusjon } = useContext(RefusjonContext);

    switch (refusjon.status) {
        case RefusjonStatus.FOR_TIDLIG:
            return (
                <FeilSide
                    advarselType="info"
                    feiltekst={`Du kan søke om refusjon fra ${formatterDato(
                        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                    )} når perioden er over.`}
                />
            );
        case RefusjonStatus.KLAR_FOR_INNSENDING:
            return <RefusjonSide />;
        case RefusjonStatus.UTGÅTT:
            return (
                <FeilSide
                    advarselType="warning"
                    feiltekst={`Fristen for å søke om refusjon for denne perioden gikk ut ${formatterDato(
                        refusjon.fristForGodkjenning
                    )}. Innvilget tilskudd er derfor trukket tilbake.`}
                />
            );
        case RefusjonStatus.ANNULLERT:
            return <FeilSide advarselType="warning" feiltekst="Refusjonen er annullert." />;
        case RefusjonStatus.SENDT_KRAV:
        case RefusjonStatus.GODKJENT_MINUSBELØP:
        case RefusjonStatus.GODKJENT_NULLBELØP:
        case RefusjonStatus.UTBETALT:
        case RefusjonStatus.UTBETALING_FEILET:
            return <KvitteringSide />;
        case RefusjonStatus.KORRIGERT:
            return <KvitteringKorreksjon />;
    }
};

const Refusjon: FunctionComponent = () => {
    return (
        <div style={{ margin: '0 auto', maxWidth: '55rem' }}>
            <div style={{ flex: '0 0 55rem', flexShrink: 1 }}>
                <TilbakeTilOversikt />
                <Komponent />
            </div>
        </div>
    );
};

export default Refusjon;
