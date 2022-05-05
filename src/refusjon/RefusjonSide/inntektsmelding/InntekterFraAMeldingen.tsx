import _ from 'lodash';
import React, { FunctionComponent, useContext } from 'react';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst } from '../../../messages';
import { refusjonApnet } from '../../../utils/amplitude-utils';
import { formatterDato, formatterPeriode, NORSK_MÅNEDÅR_FORMAT } from '../../../utils/datoUtils';
import { formatterPenger } from '../../../utils/PengeUtils';
import BEMHelper from '../../../utils/bem';
import './inntektsMelding.less';
import InntektsMeldingHeader from './InntektsMeldingHeader';
import { inntektProperties } from './inntektProperties';
import InntektsmeldingTabellHeader from './inntektsmeldingTabell/InntektsmeldingTabellHeader';
import IngenInntekter from './inntektsmeldingVarsel/IngenInntekter';
import IngenRefunderbareInntekter from './inntektsmeldingVarsel/IngenRefunderbareInntekter';
import HarInntekterMenIkkeForHeleTilskuddsperioden from './inntektsmeldingVarsel/HarInntekterMenIkkeForHeleTilskuddsperioden';
import InntektValg from './inntektsmeldingTabell/InntektValg';
import { RefusjonContext } from '../Refusjon';

export const inntektBeskrivelse = (beskrivelse: string | undefined) => {
    if (beskrivelse === undefined) return '';
    else if (beskrivelse === '') return 'Inntekt';
    return lønnsbeskrivelseTekst[beskrivelse] ?? 'Inntekt: ' + beskrivelse;
};

export interface Props {
    kvitteringVisning: boolean;
}

const InntekterFraAMeldingen: FunctionComponent<Props> = ({ kvitteringVisning }) => {
    const cls = BEMHelper('inntektsmelding');
    const refusjon = useContext(RefusjonContext);
    const { inntektsgrunnlag } = refusjon.refusjonsgrunnlag;

    const {
        antallInntekterSomErMedIGrunnlag,
        ingenInntekter,
        ingenRefunderbareInntekter,
        harInntekterMenIkkeForHeleTilskuddsperioden,
    } = inntektProperties(refusjon);

    refusjonApnet(
        refusjon,
        antallInntekterSomErMedIGrunnlag ?? 0,
        ingenInntekter,
        ingenRefunderbareInntekter,
        harInntekterMenIkkeForHeleTilskuddsperioden
    );

    return (
        <div className={cls.element('graboks-wrapper')}>
            <InntektsMeldingHeader refusjon={refusjon} />
            {inntektsgrunnlag?.bruttoLønn && (
                <i>Her hentes inntekter rapportert inn til a-meldingen i tilskuddsperioden og en måned etter.</i>
            )}
            {inntektsgrunnlag?.inntekter.find((inntekt) => inntekt.erMedIInntektsgrunnlag) && (
                <>
                    <VerticalSpacer rem={1} />
                    <table className={cls.element('inntektstabell')}>
                        <InntektsmeldingTabellHeader />
                        <tbody>
                            {_.sortBy(
                                inntektsgrunnlag?.inntekter.filter((i) => i.erMedIInntektsgrunnlag),
                                [
                                    'måned',
                                    'opptjeningsperiodeFom',
                                    'opptjeningsperiodeTom',
                                    'opptjent',
                                    'beskrivelse',
                                    'id',
                                ]
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
                                    {inntektsgrunnlag?.inntekter.filter((inntekt) => inntekt.erOpptjentIPeriode) && (
                                        <InntektValg
                                            inntekt={inntekt}
                                            refusjonId={refusjon.id}
                                            kvitteringVisning={kvitteringVisning}
                                        />
                                    )}
                                    <td>{formatterPenger(inntekt.beløp)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            <IngenInntekter ingenInntekter={ingenInntekter} />
            <IngenRefunderbareInntekter ingenRefunderbareInntekter={ingenRefunderbareInntekter} />
            <HarInntekterMenIkkeForHeleTilskuddsperioden
                tilskuddsgrunnlag={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag}
                harInntekterMenIkkeForHeleTilskuddsperioden={harInntekterMenIkkeForHeleTilskuddsperioden}
            />
        </div>
    );
};
export default InntekterFraAMeldingen;
