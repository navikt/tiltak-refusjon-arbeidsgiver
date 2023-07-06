import { Alert, ConfirmationPanel } from '@navikt/ds-react';
import { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction, useContext, useState } from 'react';
import { RefusjonContext } from '../../../RefusjonProvider';
import LagreKnapp from '../../../komponenter/LagreKnapp';
import Utregning from '../../../komponenter/Utregning';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import BEMHelper from '../../../utils/bem';
import { Refusjon } from '../../refusjon';
import SummeringBoks from '../SummeringBoks';
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
    const cls = BEMHelper('refusjonInnsending');

    const { feilListe } = useContext(RefusjonContext);

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
                inntektsgrunnlag={refusjon.refusjonsgrunnlag.inntektsgrunnlag}
            />
            <SummeringBoks refusjonsgrunnlag={refusjon.refusjonsgrunnlag} status={refusjon.status} />

            <VerticalSpacer rem={1} />

            <ConfirmationPanel
                className={cls.element('panel')}
                onChange={() => bekreftOpplysninger()}
                checked={bekrefetKorrekteOpplysninger}
                label="Jeg bekrefter at opplysningene er korrekte."
                error={ikkeBekreftetFeilmelding}
            >
                NAV og Riksrevisjonen kan iverksette kontroll (for eksempel stikkprøvekontroll) med at midlene nyttes
                etter forutsetningene, jfr. Bevilgningsreglementet av 26.05.2005 § 10, 2. ledd
            </ConfirmationPanel>

            {feilListe.includes('bedriftKid') && (
                <>
                    <Alert variant="error">KID-nummeret du har fylt ut er ikke gyldig.</Alert>
                    <VerticalSpacer rem={1} />
                </>
            )}

            <LagreKnapp variant="primary" lagreFunksjon={() => fullførRefusjon()}>
                Fullfør
            </LagreKnapp>
        </div>
    );
};
export default RefusjonInnsending;
