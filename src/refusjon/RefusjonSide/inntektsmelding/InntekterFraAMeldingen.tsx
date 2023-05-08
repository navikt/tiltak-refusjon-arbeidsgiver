import { Link } from '@navikt/ds-react';
import _ from 'lodash';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst } from '../../../messages';
import { hentInntekterLengerFrem, useHentRefusjon } from '../../../services/rest-service';
import { formatterPenger } from '../../../utils/PengeUtils';
import { refusjonApnet } from '../../../utils/amplitude-utils';
import BEMHelper from '../../../utils/bem';
import {
    NORSK_MÅNEDÅR_FORMAT,
    formatterDato,
    formatterPeriode,
    månedsNavn,
    månedsNavnPlusMåned,
} from '../../../utils/datoUtils';
import InntektsMeldingHeader from './InntektsMeldingHeader';
import { inntektProperties } from './inntektProperties';
import './inntektsMelding.less';
import InntektValg from './inntektsmeldingTabell/InntektValg';
import InntektsmeldingTabellHeader from './inntektsmeldingTabell/InntektsmeldingTabellHeader';
import IngenInntekter from './inntektsmeldingVarsel/IngenInntekter';
import IngenRefunderbareInntekter from './inntektsmeldingVarsel/IngenRefunderbareInntekter';

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
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const { inntektsgrunnlag } = refusjon.refusjonsgrunnlag;

    const { antallInntekterSomErMedIGrunnlag, ingenInntekter, ingenRefunderbareInntekter } =
        inntektProperties(refusjon);

    refusjonApnet(refusjon, antallInntekterSomErMedIGrunnlag ?? 0, ingenInntekter, ingenRefunderbareInntekter);

    const finnesInntekterMenAlleErHuketAvForÅIkkeVæreOpptjentIPerioden = () => {
        if (inntektsgrunnlag?.inntekter.filter((i) => i.erMedIInntektsgrunnlag).length === 0) {
            return false;
        }
        const inntekterIkkeOptjentIPeriode = inntektsgrunnlag?.inntekter
            .filter((i) => i.erMedIInntektsgrunnlag)
            .filter((i) => i.erOpptjentIPeriode === false);
        const ingenAvInntekteneErOpptjentIPerioden =
            inntekterIkkeOptjentIPeriode?.length ===
            inntektsgrunnlag?.inntekter.filter((i) => i.erMedIInntektsgrunnlag).length;
        return ingenAvInntekteneErOpptjentIPerioden;
    };

    const merkForHentingAvInntekterFrem = (merking: boolean) => {
        hentInntekterLengerFrem(refusjon.id, merking);
    };

    const harBruttolønn = inntektsgrunnlag ? inntektsgrunnlag?.bruttoLønn > 0 : false;

    const månedNavn = månedsNavn(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);
    const nesteMånedNavn = månedsNavnPlusMåned(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom, 1);

    return (
        <div className={cls.element('graboks-wrapper')}>
            <InntektsMeldingHeader refusjon={refusjon} />
            {harBruttolønn && (
                <i>
                    Her hentes inntekter rapportert inn til a-meldingen for måneden refusjonen gjelder for (
                    {formatterPeriode(
                        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                    )}
                    ) {refusjon.unntakOmInntekterToMånederFrem ? 'og 2 måneder etter' : ''}{' '}
                    {refusjon.hentInntekterLengerFrem !== null && 'og 1 måned frem'}.
                </i>
            )}
            {!refusjon.hentInntekterLengerFrem && (
                <AlertStripeInfo>
                    Finner du ikke inntekten(e) du leter etter? Klikk{' '}
                    <Link onClick={() => merkForHentingAvInntekterFrem(true)} style={{ cursor: 'pointer' }}>
                        her
                    </Link>{' '}
                    for å hente inntekter rapportert i {nesteMånedNavn} også.
                </AlertStripeInfo>
            )}
            {/* {refusjon.hentInntekterLengerFrem && (
                    <AlertStripeAdvarsel>
                        Dukker det opp inntekter du ikke forventer å se, for mai måned? Klikk{' '}
                        <Link onClick={() => merkForHentingAvInntekterFrem(false)} style={{cursor: 'pointer'}}>her</Link>
                    </AlertStripeAdvarsel>
                )} */}
            {inntektsgrunnlag?.inntekter.find((inntekt) => inntekt.erMedIInntektsgrunnlag) &&
                inntektsgrunnlag?.inntekter.filter((i) => i.erMedIInntektsgrunnlag).length > 1 && (
                    <>
                        <VerticalSpacer rem={1} />
                        <AlertStripeInfo>
                            <div>
                                Vi har funnet flere innrapporterte inntekter. Huk kun av for inntekter som er opptjent i{' '}
                                <strong>{månedNavn}</strong>.
                            </div>
                        </AlertStripeInfo>
                    </>
                )}
            {inntektsgrunnlag?.inntekter.find((inntekt) => inntekt.erMedIInntektsgrunnlag) && (
                <>
                    <VerticalSpacer rem={1} />
                    <table className={cls.element('inntektstabell')}>
                        <InntektsmeldingTabellHeader refusjon={refusjon} />
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
                                    <td>
                                        {/* inntekt.id */} {inntektBeskrivelse(inntekt.beskrivelse)}
                                    </td>
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
            {finnesInntekterMenAlleErHuketAvForÅIkkeVæreOpptjentIPerioden() && (
                <>
                    <VerticalSpacer rem={1} />
                    <AlertStripeAdvarsel>
                        <Element>
                            Du har huket av for at ingen av de innhentede inntektene er opptjent i {månedNavn}.
                        </Element>
                        <Normaltekst>
                            Hvis du har rapportert inntekter for sent, kan du ta kontakt med NAV-veileder for å åpne for
                            henting av inntekter som er rapport inn for senere måneder.
                        </Normaltekst>
                    </AlertStripeAdvarsel>
                </>
            )}
        </div>
    );
};
export default InntekterFraAMeldingen;
