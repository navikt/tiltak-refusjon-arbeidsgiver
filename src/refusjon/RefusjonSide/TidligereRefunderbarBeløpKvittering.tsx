import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import BEMHelper from '../../utils/bem';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjon } from '../refusjon';

interface Properties {
    refusjon: Refusjon;
}

const TidligereRefunderbarBeløpKvittering: FunctionComponent<Properties> = ({ refusjon }: PropsWithChildren<Properties>) => {
    const cls = BEMHelper('refusjonside');
    if (refusjon.refusjonsgrunnlag.fratrekkRefunderbarBeløp) {
        return (
            <div className={cls.element('fratrekk-sykepenger')}>
                <Undertittel className={cls.element('fratrekk-sykepenger-tittel')}>Fravær i perioden</Undertittel>
                {refusjon.refusjonsgrunnlag.fratrekkRefunderbarBeløp && refusjon.refusjonsgrunnlag.beregning && (
                    <>
                        <Element>Har deltaker har hatt fravær med lønn som blir refundert av NAV i denne perioden?</Element>
                        <Element>Ja</Element>
                        <VerticalSpacer rem={1} />
                        <Normaltekst>
                            Har dere fått utbetalt refusjon av lønn på grunn av fravær for deltaker, for eksempel refusjon av
                            sykepenger, så skal dette beløpet trekkes fra refusjon om {tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]}. Beløpet som skal trekkes
                            fra er det beløpet dere har fått i refusjon av NAV.
                        </Normaltekst>
                        <VerticalSpacer rem={1} />
                        <Element>
                            Refusjonsbeløpet på grunn av fravær: {formatterPenger(refusjon.refusjonsgrunnlag.beregning?.tidligereRefundertBeløp)}  
                        </Element>
                    </>
                )}
            </div>

        )
    }
    return null;
    
};

export default TidligereRefunderbarBeløpKvittering;
