// DENNE KOMPONENTEN SKAL KUN BRUKES TIL VISNING AV KVITTERINGER PÅ REFUSJONER SOM ER SENDT INN FØR SPØRSMÅL OM INNTEKTSLINJE ER OPPTJENT I PERIODEN
import _ from 'lodash';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst } from '../../messages';
import { useHentRefusjon } from '../../services/rest-service';
import { refusjonApnet } from '../../utils/amplitude-utils';
import { formatterDato, formatterPeriode, NORSK_DATO_OG_TID_FORMAT, NORSK_MÅNEDÅR_FORMAT } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';

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

// DENNE KOMPONENTEN SKAL KUN BRUKES TIL VISNING AV KVITTERINGER PÅ REFUSJONER SOM ER SENDT INN FØR SPØRSMÅL OM INNTEKTSLINJE ER OPPTJENT I PERIODEN
const InntekterFraAMeldingen: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const antallInntekterSomErMedIGrunnlag = refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.erMedIInntektsgrunnlag
    ).length;

    const ingenInntekter =
        !refusjon.refusjonsgrunnlag.inntektsgrunnlag ||
        refusjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter.length === 0;

    const ingenRefunderbareInntekter: boolean =
        !!refusjon.refusjonsgrunnlag.inntektsgrunnlag &&
        refusjon.refusjonsgrunnlag.inntektsgrunnlag.inntekter.length > 0 &&
        antallInntekterSomErMedIGrunnlag === 0;

    refusjonApnet(refusjon, antallInntekterSomErMedIGrunnlag ?? 0, ingenInntekter, ingenRefunderbareInntekter);

    return (
        <GråBoks>
            <Fleks>
                <Undertittel style={{ marginBottom: '1rem' }}>Inntekter hentet fra a-meldingen</Undertittel>
                {refusjon.refusjonsgrunnlag.inntektsgrunnlag && (
                    <Normaltekst>
                        Sist hentet:{' '}
                        {formatterDato(
                            refusjon.refusjonsgrunnlag.inntektsgrunnlag.innhentetTidspunkt,
                            NORSK_DATO_OG_TID_FORMAT
                        )}
                    </Normaltekst>
                )}
            </Fleks>
            {refusjon.refusjonsgrunnlag.inntektsgrunnlag?.bruttoLønn !== undefined &&
                refusjon.refusjonsgrunnlag.inntektsgrunnlag?.bruttoLønn !== null && (
                    <i>Her hentes inntekter rapportert inn til a-meldingen i tilskuddsperioden og en måned etter.</i>
                )}
            {refusjon.refusjonsgrunnlag.inntektsgrunnlag &&
                refusjon.refusjonsgrunnlag.inntektsgrunnlag.inntekter.find(
                    (inntekt) => inntekt.erMedIInntektsgrunnlag
                ) && (
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
                                    refusjon.refusjonsgrunnlag.inntektsgrunnlag.inntekter.filter(
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
                                {refusjon.refusjonsgrunnlag.inntektsgrunnlag?.bruttoLønn && (
                                    <tr>
                                        <td colSpan={3}>
                                            <b>Sum</b>
                                        </td>
                                        <td>
                                            <b style={{ whiteSpace: 'nowrap' }}>
                                                {formatterPenger(
                                                    refusjon.refusjonsgrunnlag.inntektsgrunnlag.bruttoLønn
                                                )}
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
        </GråBoks>
    );
};
export default InntekterFraAMeldingen;
