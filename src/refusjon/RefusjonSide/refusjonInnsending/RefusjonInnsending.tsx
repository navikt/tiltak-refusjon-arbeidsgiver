import React, { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction, useEffect, useState } from 'react';
import Utregning from '../../../komponenter/Utregning';
import SummeringBoks from '../SummeringBoks';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import LagreKnapp from '../../../komponenter/LagreKnapp';
import { Refusjon } from '../../refusjon';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import BEMHelper from '../../../utils/bem';
import './refusjonInnsending.less';

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
    const [sluttsumForLiten, setSluttsumForLiten] = useState<boolean>(false);
    const cls = BEMHelper('refusjonInnsending');
    const { harTattStillingTilAlleInntektslinjer } = refusjon;
    const sluttsummen: number | undefined = refusjon.refusjonsgrunnlag?.beregning?.refusjonsbeløp;

    useEffect(() => {
        setSluttsumForLiten(false);
    }, [harTattStillingTilAlleInntektslinjer]);

    if (
        !refusjon.harTattStillingTilAlleInntektslinjer ||
        !refusjon.refusjonsgrunnlag.beregning ||
        typeof refusjon.refusjonsgrunnlag.fratrekkSykepenger !== 'boolean' ||
        typeof refusjon.refusjonsgrunnlag.inntekterKunFraTiltaket !== 'boolean'
    ) {
        return null;
    }
    const bekreftOpplysninger = () => {
        setBekrefetKorrekteOpplysninger(!bekrefetKorrekteOpplysninger);
        setIkkeBekreftetFeilmelding('');
    };

    const fullførRefusjon = async (): Promise<void> => {
        if (sluttsummen && sluttsummen < 1) return setSluttsumForLiten(true);
        if (bekrefetKorrekteOpplysninger) {
            return setVisGodkjennModal(true);
        }
        setIkkeBekreftetFeilmelding('Du må samtykke at opplysningene er riktig, før du kan sende inn skjemaet.');
    };

    return (
        <div className={cls.className}>
            <Utregning
                beregning={refusjon.refusjonsgrunnlag.beregning}
                tilskuddsgrunnlag={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag}
            />
            <SummeringBoks refusjonsgrunnlag={refusjon.refusjonsgrunnlag} />
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
            <div className={cls.element('sluttsumForLiten', sluttsumForLiten ? 'vis-melding' : '')}>
                <AlertStripeFeil>Kan ikke sende inn refusjonskrav hvor summen ikke overstiger 0 kr</AlertStripeFeil>
            </div>
            <LagreKnapp type="hoved" lagreFunksjon={() => fullførRefusjon()}>
                Fullfør
            </LagreKnapp>
        </div>
    );
};
export default RefusjonInnsending;
