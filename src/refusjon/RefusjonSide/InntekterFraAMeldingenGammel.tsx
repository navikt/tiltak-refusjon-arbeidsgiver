// DENNE KOMPONENTEN SKAL KUN BRUKES TIL VISNING AV KVITTERINGER PÅ REFUSJONER SOM ER SENDT INN FØR SPØRSMÅL OM INNTEKTSLINJE ER OPPTJENT I PERIODEN
import _ from 'lodash';
import { FunctionComponent } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst } from '../../messages';
import { refusjonApnet } from '../../utils/amplitude-utils';
import { formatterDato, formatterPeriode, NORSK_DATO_OG_TID_FORMAT, NORSK_MÅNEDÅR_FORMAT } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import BEMHelper from '../../utils/bem';
import '../RefusjonSide/InntekterFraAMeldingen.less';
import Boks from '../../komponenter/Boks/Boks';
import { Refusjon } from '../refusjon';

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
const InntekterFraAMeldingen: FunctionComponent<{ refusjon: Refusjon }> = ({ refusjon }) => {
    const cls = BEMHelper('inntekterFraAMeldingen');
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
        <Boks variant="grå">
            <Heading size="small" style={{ marginBottom: '1rem' }}>
                Inntekter hentet fra a-meldingen
            </Heading>
            {refusjon.refusjonsgrunnlag.inntektsgrunnlag && (
                <BodyShort size="small">
                    Sist hentet:{' '}
                    {formatterDato(
                        refusjon.refusjonsgrunnlag.inntektsgrunnlag.innhentetTidspunkt,
                        NORSK_DATO_OG_TID_FORMAT
                    )}
                </BodyShort>
            )}
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
export default InntekterFraAMeldingen;
