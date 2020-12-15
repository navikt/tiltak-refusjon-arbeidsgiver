import { Element, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import HvitBoks from '../../../komponenter/HvitBoks';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../../messages';
import { gjorInntektsoppslag, useHentRefusjon } from '../../../services/rest-service';
import BEMHelper from '../../../utils/bem';
import { formatterDato } from '../../../utils/datoUtils';
import './StartSteg.less';
import { Nettressurs, Status } from '../../../nettressurs';
import LagreKnapp from '../../../komponenter/LagreKnapp';

const cls = BEMHelper('startsteg');

const StartSteg: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const history = useHistory();

    const [inntektsoppslag, setInntektsoppslag] = useState<Nettressurs<any>>({ status: Status.IkkeLastet });

    const startRefusjon = async () => {
        try {
            setInntektsoppslag({ status: Status.LasterInn });
            await gjorInntektsoppslag(refusjonId);
            setInntektsoppslag({ status: Status.Sendt });
        } catch (e) {
            setInntektsoppslag({ status: Status.Feil, error: e.feilmelding ?? 'Uventet feil' });
        }
    };

    useEffect(() => {
        if (inntektsoppslag.status === Status.Sendt) {
            history.push({ pathname: `/refusjon/${refusjon.id}/inntekt`, search: window.location.search });
        }
    }, [inntektsoppslag]);

    return (
        <>
            <VerticalSpacer rem={2} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <HvitBoks>
                    <Undertittel>Refusjon av {tiltakstypeTekst[refusjon.tilskuddsgrunnlag.tiltakstype]}</Undertittel>
                    <VerticalSpacer rem={2} />
                    <Element>Periode</Element>
                    <Normaltekst>
                        {`${formatterDato(refusjon.tilskuddsgrunnlag.tilskuddFom)} - ${formatterDato(
                            refusjon.tilskuddsgrunnlag.tilskuddTom
                        )}`}
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <Element>Deltaker</Element>
                    <Normaltekst>
                        {`${refusjon.tilskuddsgrunnlag.deltakerFornavn} ${refusjon.tilskuddsgrunnlag.deltakerEtternavn}`}
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <Element>Ansvarlig i virksomheten</Element>
                    <Normaltekst>Kontaktpersonen i bedriften (mangler)</Normaltekst>
                    <Normaltekst>12345678 (mangler)</Normaltekst>
                    <VerticalSpacer rem={2} />
                    <div className={cls.element('infoboks')}>
                        <Systemtittel>Før du begynner</Systemtittel>
                        <VerticalSpacer rem={2} />
                        <Element>Slik fungerer det</Element>
                        <Normaltekst>
                            Lønnstilskudd skal kun dekke lønnsutgifter og ..... NAV bruker opplysninger dere har
                            rapportert i A-meldingen for å beregne hva dere har krav på i refusjon for perioden med
                            lønnstilskudd.
                        </Normaltekst>
                        <VerticalSpacer rem={1} />
                        <Element> Slik går du frem</Element>
                        <Normaltekst>
                            Se over at inntektsopplysningene vi har hentet stemmer. - Dersom dere ønsker å endre på noe
                            må dere gjøre det i A-meldingen. Sjekk hvilke opplysninger dere har rapportert i A-meldingen
                            her
                        </Normaltekst>
                    </div>
                    <VerticalSpacer rem={2} />
                    <LagreKnapp onClick={startRefusjon} nettressurs={inntektsoppslag} type="hoved">
                        Start
                    </LagreKnapp>
                </HvitBoks>
            </div>
        </>
    );
};

export default StartSteg;
