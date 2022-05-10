import React, { FunctionComponent } from 'react';
import VerticalSpacer from '../../../../komponenter/VerticalSpacer';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import { formatterPeriode } from '../../../../utils/datoUtils';
import { Tilskuddsgrunnlag } from '../../../refusjon';

interface Props {
    tilskuddsgrunnlag: Tilskuddsgrunnlag;
    harInntekterMenIkkeForHeleTilskuddsperioden: boolean;
}

const HarInntekterMenIkkeForHeleTilskuddsperioden: FunctionComponent<Props> = ({
    tilskuddsgrunnlag,
    harInntekterMenIkkeForHeleTilskuddsperioden,
}: Props) =>
    harInntekterMenIkkeForHeleTilskuddsperioden ? (
        <div className={'inntektsmelding__varsel-linje'}>
            <>
                <VerticalSpacer rem={1} />
                <AlertStripeAdvarsel>
                    Vi kan ikke finne inntekter for hele perioden som er avtalt. Dette kan skyldes at det ikke er
                    rapportert inn inntekter for alle månedene i den avtalte perioden enda.
                    <Element>
                        Du kan kun søke om refusjon for den avtalte perioden{' '}
                        {formatterPeriode(tilskuddsgrunnlag?.tilskuddFom, tilskuddsgrunnlag?.tilskuddTom)} én gang.
                        Sikre deg derfor at alle inntekter innenfor perioden er rapportert før du klikker fullfør.
                    </Element>
                </AlertStripeAdvarsel>
                <VerticalSpacer rem={1} />
            </>
        </div>
    ) : null;

export default HarInntekterMenIkkeForHeleTilskuddsperioden;
