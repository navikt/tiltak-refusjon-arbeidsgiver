import React, { Fragment, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { useHentRefusjon } from '../../services/rest-service';
import { useParams } from 'react-router';
import { refusjonApnet } from '../../utils/amplitude-utils';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { formatterDato, formatterPeriode, NORSK_DATO_OG_TID_FORMAT, NORSK_MÅNEDÅR_FORMAT } from '../../utils/datoUtils';
import { Warning } from '@navikt/ds-icons';
import { formatterPenger } from '../../utils/PengeUtils';
import { lønnsbeskrivelseTekst } from '../../messages';

const GråBoks = styled.div`
    background-color: #eee;
    border-radius: 4px;
    padding: 1.5rem;
`;

const Fleks = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: baseline;
`;

const InntekterTabell = styled.div`
    background-color: @navLysGra;
    border-radius: 4px;
    display: grid;
    grid-template-columns: auto 5rem 11rem 5.5rem;
    column-gap: 1rem;
    row-gap: 0.75rem;
`;

const inntektBeskrivelse = (beskrivelse: string | undefined) => {
    if (beskrivelse === undefined) {
        return '';
    } else if (beskrivelse === '') {
        return 'Inntekt';
    } else {
        return lønnsbeskrivelseTekst[beskrivelse] ?? 'Inntekt: ' + beskrivelse;
    }
};

const InntekterFraAMeldingen: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const antallInntekterSomErMedIGrunnlag = refusjon.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.erMedIInntektsgrunnlag
    ).length;

    const ingenInntekter = !refusjon.inntektsgrunnlag || refusjon.inntektsgrunnlag?.inntekter.length === 0;

    const ingenRefunderbareInntekter: boolean =
        !!refusjon.inntektsgrunnlag &&
        refusjon.inntektsgrunnlag.inntekter.length > 0 &&
        antallInntekterSomErMedIGrunnlag === 0;

    const harInntekterMenIkkeForHeleTilskuddsperioden =
        refusjon.status === 'KLAR_FOR_INNSENDING' &&
        !refusjon.harInntektIAlleMåneder &&
        !!refusjon.inntektsgrunnlag &&
        refusjon.inntektsgrunnlag.inntekter.length > 0;

    refusjonApnet(
        refusjon,
        antallInntekterSomErMedIGrunnlag ?? 0,
        ingenInntekter,
        ingenRefunderbareInntekter,
        harInntekterMenIkkeForHeleTilskuddsperioden
    );

    return (
        <GråBoks>
            <Fleks>
                <Undertittel style={{ marginBottom: '0.5rem' }}>Inntekter hentet fra a-meldingen</Undertittel>
                {refusjon.inntektsgrunnlag && (
                    <Normaltekst>
                        Sist hentet:{' '}
                        {formatterDato(refusjon.inntektsgrunnlag.innhentetTidspunkt, NORSK_DATO_OG_TID_FORMAT)}
                    </Normaltekst>
                )}
            </Fleks>
            {refusjon.inntektsgrunnlag && refusjon.inntektsgrunnlag.inntekter.length > 0 && (
                <>
                    <VerticalSpacer rem={1} />
                    <InntekterTabell>
                        <Element>Lønnsbeskrivelse</Element>
                        <Element>År/måned</Element>
                        <Element>Opptjeningsperiode</Element>
                        <Element>Beløp</Element>
                        {refusjon.inntektsgrunnlag.inntekter
                            .filter((inntekt) => inntekt.erMedIInntektsgrunnlag)
                            .sort((a, b) => {
                                if (a.måned === b.måned) {
                                    if (
                                        a.beskrivelse === b.beskrivelse ||
                                        a.beskrivelse === undefined ||
                                        b.beskrivelse === undefined
                                    ) {
                                        return a.id.localeCompare(b.id);
                                    }
                                    return a.beskrivelse.localeCompare(b.beskrivelse);
                                }
                                return a.måned.localeCompare(b.måned);
                            })
                            .map((inntekt) => (
                                <Fragment key={inntekt.id}>
                                    <Normaltekst>{inntektBeskrivelse(inntekt.beskrivelse)}</Normaltekst>
                                    <Normaltekst>{formatterDato(inntekt.måned, NORSK_MÅNEDÅR_FORMAT)}</Normaltekst>

                                    <div>
                                        {inntekt.opptjeningsperiodeFom && inntekt.opptjeningsperiodeTom ? (
                                            formatterPeriode(
                                                inntekt.opptjeningsperiodeFom,
                                                inntekt.opptjeningsperiodeTom
                                            )
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                <Warning
                                                    style={{ marginRight: '0.25rem', width: '24px', height: '24px' }}
                                                />
                                                <Normaltekst>Ikke rapportert opptjeningsperiode</Normaltekst>
                                            </div>
                                        )}
                                    </div>

                                    <Normaltekst>{formatterPenger(inntekt.beløp)}</Normaltekst>
                                </Fragment>
                            ))}
                        {refusjon.beregning?.lønn && (
                            <>
                                <hr style={{ gridColumnStart: 'span 4', width: '100%' }} />
                                <Element style={{ gridColumnStart: 'span 3' }}>Sum</Element>
                                <Element>{formatterPenger(refusjon.beregning.lønn)}</Element>
                            </>
                        )}
                    </InntekterTabell>
                    <VerticalSpacer rem={1} />
                </>
            )}
            {ingenInntekter && (
                <>
                    <VerticalSpacer rem={1} />
                    <AlertStripeAdvarsel>
                        Vi kan ikke finne inntekter fra a-meldingen for denne perioden. Når a-meldingen er oppdatert vil
                        inntektsopplysningene vises her automatisk.
                    </AlertStripeAdvarsel>
                    <VerticalSpacer rem={1} />
                </>
            )}
            {ingenRefunderbareInntekter && (
                <>
                    <VerticalSpacer rem={1} />
                    <AlertStripeAdvarsel>
                        Vi kan ikke finne noen lønnsinntekter for denne perioden. Når a-meldingen er oppdatert vil
                        inntektsopplysningene vises her automatisk.
                    </AlertStripeAdvarsel>
                    <VerticalSpacer rem={1} />
                </>
            )}
            {harInntekterMenIkkeForHeleTilskuddsperioden && (
                <>
                    <VerticalSpacer rem={1} />
                    <AlertStripeAdvarsel>
                        Vi kan ikke finne inntekter for hele perioden som er avtalt. Dette kan skyldes at det ikke er
                        rapportert inn inntekter for alle månedene i den avtalte perioden enda.
                        <Element>
                            Du kan kun søke om refusjon for den avtalte perioden{' '}
                            {formatterPeriode(
                                refusjon.tilskuddsgrunnlag.tilskuddFom,
                                refusjon.tilskuddsgrunnlag.tilskuddTom
                            )}{' '}
                            én gang. Sikre deg derfor at alle inntekter innenfor perioden er rapportert før du klikker
                            fullfør.
                        </Element>
                    </AlertStripeAdvarsel>
                    <VerticalSpacer rem={1} />
                </>
            )}
        </GråBoks>
    );
};
export default InntekterFraAMeldingen;
