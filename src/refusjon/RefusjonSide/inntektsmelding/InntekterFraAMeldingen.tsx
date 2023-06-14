import { Alert, Button, Heading } from '@navikt/ds-react';
import _ from 'lodash';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst } from '../../../messages';
import { hentInntekterLengerFrem, useHentRefusjon } from '../../../services/rest-service';
import { refusjonApnet } from '../../../utils/amplitude-utils';
import BEMHelper from '../../../utils/bem';
import { formatterPeriode, månedsNavn, månedsNavnPlusMåned } from '../../../utils/datoUtils';
import { RefusjonStatus } from '../../status';
import InntektsMeldingHeader from './InntektsMeldingHeader';
import { inntektProperties } from './inntektProperties';
import './inntektsMelding.less';
import InntektsmeldingTabellBody from './inntektsmeldingTabell/InntektsmeldingTabellBody';
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

    const inntektGrupperObjekt = _.groupBy(inntektsgrunnlag?.inntekter, (inntekt) => inntekt.måned);
    const inntektGrupperListe = Object.entries(inntektGrupperObjekt);
    let inntektGrupperListeSortert = _.sortBy(inntektGrupperListe, [(i) => i[0]]);

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
                    ){' '}
                    {refusjon.unntakOmInntekterFremitid ? (
                        <>og {refusjon.unntakOmInntekterFremitid} måneder etter</>
                    ) : (
                        ''
                    )}
                    {refusjon.unntakOmInntekterFremitid <= 1 &&
                        refusjon.hentInntekterLengerFrem !== null &&
                        'og 1 måned frem'}
                    .
                </i>
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
                        <Alert variant="info" size="small">
                            <div>
                                Vi har funnet flere innrapporterte inntekter. Huk kun av på Ja for inntekter som er
                                opptjent i <strong>{månedNavn}</strong>. <br />
                                Huk av Nei for inntekter som ikke er opptjent i {månedNavn}.
                            </div>
                        </Alert>
                    </>
                )}
            {inntektsgrunnlag?.inntekter.find((inntekt) => inntekt.erMedIInntektsgrunnlag) && (
                <>
                    <VerticalSpacer rem={1} />
                    {inntektGrupperListeSortert.map(([aarManed, inntektslinjer]) => (
                        <>
                            <Heading level="4" size="small" style={{ display: 'flex', justifyContent: 'center' }}>
                                Inntekt rapportert for {månedsNavn(aarManed)} ({aarManed})
                            </Heading>
                            <div style={{ borderTop: '1px solid #06893b' }}>
                                <table className={cls.element('inntektstabell')}>
                                    <InntektsmeldingTabellHeader refusjon={refusjon} />
                                    <InntektsmeldingTabellBody
                                        inntektslinjer={inntektslinjer}
                                        kvitteringVisning={kvitteringVisning}
                                    />
                                </table>
                            </div>
                            <VerticalSpacer rem={1} />
                        </>
                    ))}
                </>
            )}
            <IngenInntekter ingenInntekter={ingenInntekter} />
            <IngenRefunderbareInntekter ingenRefunderbareInntekter={ingenRefunderbareInntekter} />
            {refusjon.status === RefusjonStatus.KLAR_FOR_INNSENDING &&
                !refusjon.hentInntekterLengerFrem &&
                refusjon.unntakOmInntekterFremitid === 0 && (
                    <>
                        <VerticalSpacer rem={1} />
                        <Alert variant="info">
                            Finner du ikke inntekten(e) du leter etter? Klikk på knappen under for å hente inntekter
                            rapportert i {nesteMånedNavn} også.
                            <VerticalSpacer rem={1} />
                            <Button onClick={() => merkForHentingAvInntekterFrem(true)} size="small">
                                Hent inntekter rapportert i {nesteMånedNavn}
                            </Button>
                        </Alert>
                    </>
                )}
            {finnesInntekterMenAlleErHuketAvForÅIkkeVæreOpptjentIPerioden() && (
                <>
                    <VerticalSpacer rem={1} />
                    <Alert variant="warning" size="small">
                        <Element>
                            Du har huket av for at ingen av de innhentede inntektene er opptjent i {månedNavn}.
                        </Element>
                        <Normaltekst>
                            Hvis du har rapportert inntekter for sent, kan du ta kontakt med NAV-veileder for å åpne for
                            henting av inntekter som er rapport inn for senere måneder.
                        </Normaltekst>
                    </Alert>
                </>
            )}
        </div>
    );
};
export default InntekterFraAMeldingen;
