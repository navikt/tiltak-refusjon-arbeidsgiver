import { Element, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { useHentRefusjon } from '../../services/rest-service';
import InformasjonFraAvtalen from '../RefusjonSide/InformasjonFraAvtalen';
import SummeringBoks from '../RefusjonSide/SummeringBoks';
import Utregning from '../../komponenter/Utregning';
import InntekterFraAMeldingen from '../RefusjonSide/InntekterFraAMeldingen';
import { formatterPenger } from '../../utils/PengeUtils';
import { tiltakstypeTekst } from '../../messages';

const KvitteringSide: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);

    if (!refusjon.inntektsgrunnlag) return null;

    return (
        <HvitBoks>
            <VerticalSpacer rem={2} />
            <Innholdstittel role="heading">Kvittering for refusjon</Innholdstittel>
            <VerticalSpacer rem={1} />
            <Normaltekst>
                Refusjonskravet er nå sendt. Det vil ta 3–4 dager før pengene kommer på kontoen. Denne refusjonen vil
                bli tatt vare på under “Sendt krav”.
            </Normaltekst>
            <VerticalSpacer rem={2} />
            <InformasjonFraAvtalen />
            <VerticalSpacer rem={2} />
            <InntekterFraAMeldingen />
            <VerticalSpacer rem={2} />
            {refusjon.inntekterKunFraTiltaket !== null && refusjon.inntekterKunFraTiltaket !== undefined && (
                <div>
                    <Element>
                        Er inntektene som vi har hentet ({formatterPenger(refusjon.inntektsgrunnlag.bruttoLønn)}) kun
                        fra tiltaket {tiltakstypeTekst[refusjon.tilskuddsgrunnlag.tiltakstype]}?{' '}
                    </Element>
                    <Normaltekst>{refusjon.inntekterKunFraTiltaket ? 'Ja' : 'Nei'}</Normaltekst>
                    {refusjon.korrigertBruttoLønn !== null && refusjon.korrigertBruttoLønn !== undefined && (
                        <>
                            <VerticalSpacer rem={1} />
                            <Element>Korrigert brutto lønn:</Element>
                            <Normaltekst>{formatterPenger(refusjon.korrigertBruttoLønn)}</Normaltekst>
                        </>
                    )}
                </div>
            )}
            <VerticalSpacer rem={2} />
            <Utregning beregning={refusjon.beregning} tilskuddsgrunnlag={refusjon.tilskuddsgrunnlag} />
            <VerticalSpacer rem={4} />
            <SummeringBoks />
        </HvitBoks>
    );
};

export default KvitteringSide;
