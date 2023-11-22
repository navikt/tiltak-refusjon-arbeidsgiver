import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst } from '../../messages';
import { useHentKorreksjon, useHentRefusjon } from '../../services/rest-service';
import { formatterDato, formatterPeriode, NORSK_DATO_OG_TID_FORMAT, NORSK_MÅNEDÅR_FORMAT } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';

import BEMHelper from '../../utils/bem';
import '../RefusjonSide/InntekterFraAMeldingen.less';
import Boks from '../../komponenter/Boks/Boks';

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
    const cls = BEMHelper('inntekterFraAMeldingen');
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
        <Boks variant="grå">
            <div className={cls.element('fleks')}>
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
            </div>
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
                        <div className={cls.element('inntekterTabell')}>
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
                        </div>
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
        </Boks>
    );
};
export default InntekterFraAMeldingenKorreksjon;
