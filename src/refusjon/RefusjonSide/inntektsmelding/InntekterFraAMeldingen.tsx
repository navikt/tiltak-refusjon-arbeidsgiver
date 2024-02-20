import { Alert, Button, Heading, Label, BodyShort, Loader } from '@navikt/ds-react';
import _ from 'lodash';
import { Fragment, FunctionComponent } from 'react';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import { lønnsbeskrivelseTekst } from '../../../messages';
import { hentInntekterLengerFrem } from '../../../services/rest-service';
import { refusjonApnet } from '../../../utils/amplitude-utils';
import BEMHelper from '../../../utils/bem';
import { månedsNavn, månedsNavnPlusMåned } from '../../../utils/datoUtils';
import { RefusjonStatus } from '../../status';
import InntektsMeldingHeader from './InntektsMeldingHeader';
import { inntektProperties } from './inntektProperties';
import './inntektsMelding.less';
import InntektsmeldingTabellBody from './inntektsmeldingTabell/InntektsmeldingTabellBody';
import InntektsmeldingTabellHeader from './inntektsmeldingTabell/InntektsmeldingTabellHeader';
import IngenInntekter from './inntektsmeldingVarsel/IngenInntekter';
import IngenRefunderbareInntekter from './inntektsmeldingVarsel/IngenRefunderbareInntekter';
import { Refusjon } from '@/refusjon/refusjon';
import Boks from '@/komponenter/Boks/Boks';

export const inntektBeskrivelse = (beskrivelse: string | undefined) => {
    if (beskrivelse === undefined) return '';
    else if (beskrivelse === '') return 'Inntekt';
    return lønnsbeskrivelseTekst[beskrivelse] ?? 'Inntekt: ' + beskrivelse;
};

export interface Props {
    refusjon: Refusjon;
    kvitteringVisning: boolean;
}

const InntekterFraAMeldingen: FunctionComponent<Props> = ({ refusjon, kvitteringVisning }) => {
    const cls = BEMHelper('inntektsmelding');
    const { inntektsgrunnlag } = refusjon.refusjonsgrunnlag;

    const { antallInntekterSomErMedIGrunnlag, ingenInntekter, ingenRefunderbareInntekter } =
        inntektProperties(refusjon);

    refusjonApnet(refusjon, antallInntekterSomErMedIGrunnlag ?? 0, ingenInntekter, ingenRefunderbareInntekter);

    const finnesInntekterMenAlleErHuketAvForÅIkkeVæreOpptjentIPerioden = () => {
        if (ingenInntekter) {
            return false;
        }
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

    const merkForHentingAvInntekterFrem = () => {
        hentInntekterLengerFrem(refusjon.id, true, refusjon.sistEndret);
    };

    const harBruttolønn = inntektsgrunnlag ? inntektsgrunnlag?.bruttoLønn > 0 : false;

    const månedNavn = månedsNavn(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);
    const nesteMånedNavn = månedsNavnPlusMåned(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom, 1);

    const inntektGrupperObjekt = _.groupBy(inntektsgrunnlag?.inntekter, (inntekt) => inntekt.måned);
    const inntektGrupperListe = Object.entries(inntektGrupperObjekt);
    let inntektGrupperListeSortert = _.sortBy(inntektGrupperListe, [(i) => i[0]]);

    return (
        <Boks variant="grå">
            <InntektsMeldingHeader
                refusjonsgrunnlag={refusjon.refusjonsgrunnlag}
                unntakOmInntekterFremitid={refusjon.unntakOmInntekterFremitid}
            />
            {ingenInntekter && !refusjon.åpnetFørsteGang && <Loader type="L" />}
            {harBruttolønn && (
                <i>
                    Her hentes inntekter i form av fastlønn, timelønn, faste tillegg, uregelmessige tillegg knyttet til
                    arbeidet tid og inntekt fra veldedige eller allmennyttige organisasjoner som er rapportert inn i
                    A-meldingen for måneden refusjonen gjelder for.
                </i>
            )}
            {!kvitteringVisning &&
                inntektsgrunnlag?.inntekter.find((inntekt) => inntekt.erMedIInntektsgrunnlag) &&
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
                        <Fragment key={aarManed}>
                            <Heading level="3" size="small" style={{ display: 'flex', justifyContent: 'center' }}>
                                Inntekt rapportert for {månedsNavn(aarManed)} ({aarManed})
                            </Heading>
                            <div style={{ borderTop: '1px solid #06893b' }}>
                                <table className={cls.element('inntektstabell')}>
                                    <InntektsmeldingTabellHeader refusjonsgrunnlag={refusjon.refusjonsgrunnlag} />
                                    <InntektsmeldingTabellBody
                                        refusjonId={refusjon.id}
                                        refusjonSistEndret={refusjon.sistEndret}
                                        inntektslinjer={inntektslinjer}
                                        kvitteringVisning={kvitteringVisning}
                                    />
                                </table>
                            </div>
                            <VerticalSpacer rem={1} />
                        </Fragment>
                    ))}
                </>
            )}
            <IngenInntekter ingenInntekter={ingenInntekter} åpnetFørsteGang={refusjon.åpnetFørsteGang} />
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
                            <Button onClick={() => merkForHentingAvInntekterFrem()} size="small">
                                Hent inntekter rapportert i {nesteMånedNavn}
                            </Button>
                        </Alert>
                    </>
                )}
            {finnesInntekterMenAlleErHuketAvForÅIkkeVæreOpptjentIPerioden() && (
                <>
                    <VerticalSpacer rem={1} />
                    <Alert variant="warning" size="small">
                        <Label>
                            Du har huket av for at ingen av de innhentede inntektene er opptjent i {månedNavn}.
                        </Label>
                        <BodyShort size="small">
                            Hvis du har rapportert inntekter for sent, kan du ta kontakt med NAV-veileder for å åpne for
                            henting av inntekter som er rapport inn for senere måneder.
                        </BodyShort>
                    </Alert>
                </>
            )}
        </Boks>
    );
};
export default InntekterFraAMeldingen;
