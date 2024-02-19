import _ from 'lodash';
import React, { Fragment, FunctionComponent } from 'react';
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
import InntektsMeldingHeader from '../RefusjonSide/inntektsmelding/InntektsMeldingHeader';

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
    kvitteringVisning: boolean;
};

const InntekterFraAMeldingenKorreksjon: FunctionComponent<Props> = ({ korreksjon, kvitteringVisning }) => {
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

    const inntektGrupperObjekt = _.groupBy(
        korreksjon.refusjonsgrunnlag.inntektsgrunnlag?.inntekter,
        (inntekt) => inntekt.måned
    );
    const inntektGrupperListe = Object.entries(inntektGrupperObjekt);
    let inntektGrupperListeSortert = _.sortBy(inntektGrupperListe, [(i) => i[0]]);

    const månedNavn = månedsNavn(korreksjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);

    return (
        <Boks variant="grå">
            <InntektsMeldingHeader
                refusjonsgrunnlag={korreksjon.refusjonsgrunnlag}
                unntakOmInntekterFremitid={korreksjon.unntakOmInntekterFremitid}
            />
            {korreksjon.refusjonsgrunnlag.inntektsgrunnlag?.bruttoLønn !== undefined &&
                korreksjon.refusjonsgrunnlag.inntektsgrunnlag?.bruttoLønn !== null && (
                    <i>
                        Her hentes inntekter i form av fastlønn, timelønn, faste tillegg, uregelmessige tillegg knyttet
                        til arbeidet tid og inntekt fra veldedige eller allmennyttige organisasjoner som er rapportert
                        inn i A-meldingen for måneden refusjonen gjelder for.
                    </i>
                )}
            {korreksjon.refusjonsgrunnlag.inntektsgrunnlag &&
                korreksjon.refusjonsgrunnlag.inntektsgrunnlag.inntekter.find(
                    (inntekt) => inntekt.erMedIInntektsgrunnlag
                ) && (
                    <>
                        <div>
                            <VerticalSpacer rem={1} />
                            {inntektGrupperListeSortert.map(([aarManed, inntektslinjer]) => (
                                <Fragment key={aarManed}>
                                    <Heading
                                        level="3"
                                        size="small"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            borderBottom: '1px solid #06893b',
                                        }}
                                    >
                                        Inntekt rapportert for {månedsNavn(aarManed)} ({aarManed})
                                    </Heading>
                                    <VerticalSpacer rem={1} />
                                </Fragment>
                            ))}
                        </div>

                        <VerticalSpacer rem={1} />
                        <table className={cls.element('inntekterTabell')}>
                            <thead>
                                <tr>
                                    <th>Beskriv&shy;else</th>
                                    <th>År/mnd</th>
                                    <th>Opptjenings&shy;periode</th>
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
                                            <td>
                                                <label>{inntektValg}</label>
                                            </td>
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
