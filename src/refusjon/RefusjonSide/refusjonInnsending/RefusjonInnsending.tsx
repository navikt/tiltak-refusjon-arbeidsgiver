import React, { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction, useState } from 'react';
import Utregning from '../../../komponenter/Utregning';
import SummeringBoks from '../SummeringBoks';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import LagreKnapp from '../../../komponenter/LagreKnapp';
import { Refusjon } from '../../refusjon';
import BEMHelper from '../../../utils/bem';
import './refusjonInnsending.less';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';

interface Properties {
    refusjon: Refusjon;
    setVisGodkjennModal: Dispatch<SetStateAction<boolean>>;
}

const RefusjonInnsending: FunctionComponent<Properties> = ({
    refusjon,
    setVisGodkjennModal,
}: PropsWithChildren<Properties>) => {
    const [bekrefetKorrekteOpplysninger, setBekrefetKorrekteOpplysninger] = useState<boolean>(false);
    const [ikkeBekreftetFeilmelding, setIkkeBekreftetFeilmelding] = useState<string>('');
    const cls = BEMHelper('refusjonInnsending');

    if (
        !refusjon.harTattStillingTilAlleInntektslinjer ||
        !refusjon.refusjonsgrunnlag.beregning ||
        typeof refusjon.refusjonsgrunnlag.fratrekkRefunderbarBeløp !== 'boolean' ||
        typeof refusjon.refusjonsgrunnlag.inntekterKunFraTiltaket !== 'boolean'
    ) {
        return null;
    }
    const bekreftOpplysninger = () => {
        setBekrefetKorrekteOpplysninger(!bekrefetKorrekteOpplysninger);
        setIkkeBekreftetFeilmelding('');
    };

    const fullførRefusjon = async (): Promise<void> => {
        if (bekrefetKorrekteOpplysninger) {
            return setVisGodkjennModal(true);
        }
        setIkkeBekreftetFeilmelding('Du må samtykke at opplysningene er riktig, før du kan sende inn skjemaet.');
    };

    return (
        <div className={cls.className}>
            <Utregning
                forrigeRefusjonMinusBeløp={refusjon.refusjonsgrunnlag?.forrigeRefusjonMinusBeløp || 0}
                beregning={refusjon.refusjonsgrunnlag.beregning}
                tilskuddsgrunnlag={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag}
            />
            <SummeringBoks refusjonsgrunnlag={refusjon.refusjonsgrunnlag} />

            <VerticalSpacer rem={1} />

            <BekreftCheckboksPanel
                className={cls.element('panel')}
                onChange={() => bekreftOpplysninger()}
                checked={bekrefetKorrekteOpplysninger}
                label="Jeg bekrefter at opplysningene er korrekte."
                feil={ikkeBekreftetFeilmelding}
            >
                NAV og Riksrevisjonen kan iverksette kontroll (for eksempel stikkprøvekontroll) med at midlene nyttes
                etter forutsetningene, jfr. Bevilgningsreglementet av 26.05.2005 § 10, 2. ledd
            </BekreftCheckboksPanel>

            <LagreKnapp type="hoved" lagreFunksjon={() => fullførRefusjon()}>
                Fullfør
            </LagreKnapp>
        </div>
    );
};
export default RefusjonInnsending;
