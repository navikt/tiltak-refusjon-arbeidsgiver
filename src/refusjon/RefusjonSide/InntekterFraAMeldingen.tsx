import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { useHentRefusjon } from '../../services/rest-service';
import { useParams } from 'react-router';
import { refusjonApnet } from '../../utils/amplitude-utils';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { formatterDato, formatterPeriode, NORSK_DATO_OG_TID_FORMAT, NORSK_MÅNEDÅR_FORMAT } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { lønnsbeskrivelseTekst } from '../../messages';
import _ from 'lodash';

const GråBoks = styled.div`
    background-color: #eee;
    border-radius: 4px;
    padding: 1.5rem min(1.5rem, 2%);
`;

const Fleks = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: baseline;
`;

const InntekterTabell = styled.table`
    width: 100%;
    th,
    td {
        text-align: left;
        padding: 0.35rem 0.5rem;
    }
    th:first-child,
    td:first-child {
        padding: 0.35rem 0;
    }
    th:last-child,
    td:last-child {
        text-align: right;
        padding: 0.35rem 0;
    }
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
        refusjon.inntektsgrunnlag.inntekter.find((inntekt) => inntekt.erMedIInntektsgrunnlag) !== undefined;

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
                <Undertittel style={{ marginBottom: '1rem' }}>Inntekter hentet fra a-meldingen</Undertittel>
                {refusjon.inntektsgrunnlag && (
                    <Normaltekst>
                        Sist hentet:{' '}
                        {formatterDato(refusjon.inntektsgrunnlag.innhentetTidspunkt, NORSK_DATO_OG_TID_FORMAT)}
                    </Normaltekst>
                )}
            </Fleks>
            {refusjon.inntektsgrunnlag?.bruttoLønn !== undefined && refusjon.inntektsgrunnlag?.bruttoLønn !== null && (
                <i>Her hentes inntekter rapportert inn til a-meldingen i tilskuddsperioden og en måned etter.</i>
            )}
            {refusjon.inntektsgrunnlag &&
                refusjon.inntektsgrunnlag.inntekter.find((inntekt) => inntekt.erMedIInntektsgrunnlag) && (
                    <>
                        <VerticalSpacer rem={1} />
                        <InntekterTabell>
                            <thead>
                                <tr>
                                    <th>Beskriv&shy;else</th>
                                    <th>År/mnd</th>
                                    <th>Opptjenings&shy;periode</th>
                                    <th>Beløp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {_.sortBy(
                                    refusjon.inntektsgrunnlag.inntekter.filter(
                                        (inntekt) => inntekt.erMedIInntektsgrunnlag
                                    ),
                                    ['måned', 'opptjeningsperiodeFom', 'opptjeningsperiodeTom', 'beskrivelse', 'id']
                                ).map((inntekt) => (
                                    <tr key={inntekt.id}>
                                        <td>{inntektBeskrivelse(inntekt.beskrivelse)}</td>
                                        <td>{formatterDato(inntekt.måned, NORSK_MÅNEDÅR_FORMAT)}</td>

                                        <td>
                                            {inntekt.opptjeningsperiodeFom && inntekt.opptjeningsperiodeTom ? (
                                                formatterPeriode(
                                                    inntekt.opptjeningsperiodeFom,
                                                    inntekt.opptjeningsperiodeTom,
                                                    'DD.MM'
                                                )
                                            ) : (
                                                <em>Ikke rapportert opptjenings&shy;periode</em>
                                            )}
                                        </td>

                                        <td>{formatterPenger(inntekt.beløp)}</td>
                                    </tr>
                                ))}
                                {refusjon.inntektsgrunnlag?.bruttoLønn && (
                                    <tr>
                                        <td colSpan={3}>
                                            <b>Sum</b>
                                        </td>
                                        <td>
                                            <b style={{ whiteSpace: 'nowrap' }}>
                                                {formatterPenger(refusjon.inntektsgrunnlag.bruttoLønn)}
                                            </b>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </InntekterTabell>
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
