import React, { FunctionComponent, Suspense } from 'react';
import { useParams } from 'react-router';
import TilbakeTilOversikt from '../../komponenter/TilbakeTilOversikt';
import { useHentRefusjon } from '../../services/rest-service';
import { formatterDato } from '../../utils/datoUtils';
import KvitteringSide from '../KvitteringSide/KvitteringSide';
import { Status } from '../status';
import FeilSide from './FeilSide';
import HenterInntekterBoks from './HenterInntekterBoks';
import RefusjonSide from './RefusjonSide';

const Komponent: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);

    switch (refusjon.status) {
        case Status.KLAR_FOR_INNSENDING:
        case Status.FOR_TIDLIG:
            return <RefusjonSide />;
        case Status.UTGÅTT:
            return (
                <FeilSide
                    advarselType="advarsel"
                    feiltekst={`Fisten for å søke om refusjon for denne perioden gikk ut ${formatterDato(
                        refusjon.fristForGodkjenning
                    )}. Innvilget tilskudd er derfor trukket tilbake.`}
                />
            );
        case Status.ANNULLERT:
            return <FeilSide advarselType="advarsel" feiltekst="Refusjonen er annullert. Avtalen ble avbrutt." />;
        case Status.SENDT_KRAV:
        case Status.UTBETALT:
            return <KvitteringSide />;
    }
};

const Refusjon: FunctionComponent = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ flex: '0 0 55rem', flexShrink: 1 }}>
                <TilbakeTilOversikt />
                <Suspense fallback={<HenterInntekterBoks />}>
                    <Komponent />
                </Suspense>
            </div>
        </div>
    );
};

export default Refusjon;
