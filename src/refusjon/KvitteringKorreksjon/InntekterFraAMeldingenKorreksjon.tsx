import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst } from '../../messages';
import { useHentKorreksjon, useHentRefusjon } from '../../services/rest-service';
import { formatterDato, formatterPeriode, NORSK_DATO_OG_TID_FORMAT, NORSK_MÅNEDÅR_FORMAT } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';

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

const InntekterFraAMeldingenKorreksjon: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const korreksjonId = useHentRefusjon(refusjonId).korreksjonId;

    const korreksjon = useHentKorreksjon(korreksjonId!);

    const antallInntekterSomErMedIGrunnlag = korreksjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter.filter(
        (inntekt) => inntekt.erMedIInntektsgrunnlag
    ).length;

    const ingenInntekter =
        !korreksjon.refusjonsgrunnlag.inntektsgrunnlag ||
        korreksjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter.length === 0;

    const ingenRefunderbareInntekter: boolean =
        !!korreksjon.refusjonsgrunnlag.inntektsgrunnlag &&
        korreksjon.refusjonsgrunnlag.inntektsgrunnlag.inntekter.length > 0 &&
        antallInntekterSomErMedIGrunnlag === 0;

    return (
        <GråBoks>
            <Fleks>
                <Heading size="small" style={{ marginBottom: '1rem' }}>
                    Inntekter hentet fra a-meldingen
                </Heading>
                {korreksjon.refusjonsgrunnlag.inntektsgrunnlag && (
                    <BodyShort size="small">
                        Sist hentet:{' '}
                        {formatterDato(
                            korreksjon.refusjonsgrunnlag.inntektsgrunnlag.innhentetTidspunkt,
                            NORSK_DATO_OG_TID_FORMAT
                        )}
                    </BodyShort>
                )}
            </Fleks>
            {korreksjon.refusjonsgrunnlag.inntektsgrunnlag?.bruttoLønn !== undefined &&
                korreksjon.refusjonsgrunnlag.inntektsgrunnlag?.bruttoLønn !== null && (
                    <i>Her hentes inntekter rapportert inn til a-meldingen i tilskuddsperioden og en måned etter.</i>
                )}
            {korreksjon.refusjonsgrunnlag.inntektsgrunnlag &&
                korreksjon.refusjonsgrunnlag.inntektsgrunnlag.inntekter.find(
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
                                    korreksjon.refusjonsgrunnlag.inntektsgrunnlag.inntekter.filter(
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
                                {korreksjon.refusjonsgrunnlag.inntektsgrunnlag?.bruttoLønn && (
                                    <tr>
                                        <td colSpan={3}>
                                            <b>Sum</b>
                                        </td>
                                        <td>
                                            <b style={{ whiteSpace: 'nowrap' }}>
                                                {formatterPenger(
                                                    korreksjon.refusjonsgrunnlag.inntektsgrunnlag.bruttoLønn
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
                    <Alert variant="warning" size="small">
                        Vi kan ikke finne inntekter fra a-meldingen for denne perioden. Når a-meldingen er oppdatert vil
                        inntektsopplysningene vises her automatisk.
                    </Alert>
                    <VerticalSpacer rem={1} />
                </>
            )}
            {ingenRefunderbareInntekter && (
                <>
                    <VerticalSpacer rem={1} />
                    <Alert variant="warning" size="small">
                        Vi kan ikke finne noen lønnsinntekter for denne perioden. Når a-meldingen er oppdatert vil
                        inntektsopplysningene vises her automatisk.
                    </Alert>
                    <VerticalSpacer rem={1} />
                </>
            )}
        </GråBoks>
    );
};
export default InntekterFraAMeldingenKorreksjon;
