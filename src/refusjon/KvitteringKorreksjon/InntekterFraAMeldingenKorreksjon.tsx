import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst } from '../../messages';
import {
    formatterDato,
    formatterPeriode,
    månedsNavn,
    NORSK_DATO_OG_TID_FORMAT,
    NORSK_MÅNEDÅR_FORMAT,
} from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';

import BEMHelper from '../../utils/bem';
import '../RefusjonSide/InntekterFraAMeldingen.less';
import Boks from '../../komponenter/Boks/Boks';
import { Korreksjon } from '../refusjon';

const inntektBeskrivelse = (beskrivelse: string | undefined) => {
    if (beskrivelse === undefined) {
        return '';
    } else if (beskrivelse === '') {
        return 'Inntekt';
    } else {
        return lønnsbeskrivelseTekst[beskrivelse] ?? 'Inntekt: ' + beskrivelse;
    }
};

type Props = {
    korreksjon: Korreksjon;
};

const InntekterFraAMeldingenKorreksjon: FunctionComponent<Props> = ({ korreksjon }) => {
    const cls = BEMHelper('inntekterFraAMeldingen');

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

    const månedNavn = månedsNavn(korreksjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);

    return (
        <Boks variant="grå">
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
                        <table className={cls.element('inntekterTabell')}>
                            <thead>
                                <tr>
                                    <th>Beskriv&shy;else</th>
                                    <th>År/mnd</th>
                                    <th>Rapportert opptjenings&shy;periode</th>
                                    <th>Opptjent i {månedNavn}?</th>
                                    <th>Beløp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {_.sortBy(
                                    korreksjon.refusjonsgrunnlag.inntektsgrunnlag.inntekter.filter(
                                        (inntekt) => inntekt.erMedIInntektsgrunnlag
                                    ),
                                    ['måned', 'opptjeningsperiodeFom', 'opptjeningsperiodeTom', 'beskrivelse', 'id']
                                ).map((inntekt) => {
                                    let inntektValg = 'Ikke valgt';
                                    if (inntekt.erOpptjentIPeriode) inntektValg = 'Ja';
                                    if (inntekt.erOpptjentIPeriode === false) inntektValg = 'Nei';
                                    return (
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
                                            <div className="inntektsmelding__valgtInntekt">
                                                <label>{inntektValg}</label>
                                            </div>
                                            <td>{formatterPenger(inntekt.beløp)}</td>
                                        </tr>
                                    );
                                })}
                                {korreksjon.refusjonsgrunnlag.inntektsgrunnlag?.bruttoLønn && (
                                    <tr>
                                        <td colSpan={4}>
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
                        </table>
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
