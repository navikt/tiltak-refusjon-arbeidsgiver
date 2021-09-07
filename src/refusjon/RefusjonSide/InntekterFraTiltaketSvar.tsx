import { Element, Normaltekst } from 'nav-frontend-typografi';
import { formatterPenger } from '../../utils/PengeUtils';
import { tiltakstypeTekst } from '../../messages';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import { useHentRefusjon } from '../../services/rest-service';

const InntekterFraTiltaketSvar: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);

    if (refusjon.inntekterKunFraTiltaket === null || refusjon.inntekterKunFraTiltaket === undefined) {
        return null;
    }

    return (
        <div>
            <Element>
                Er inntektene som vi har hentet ({formatterPenger(refusjon.inntektsgrunnlag!!.bruttoLønn)}) kun fra
                tiltaket {tiltakstypeTekst[refusjon.tilskuddsgrunnlag.tiltakstype]}?{' '}
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
    );
};

export default InntekterFraTiltaketSvar;
