import { ReactComponent as CheckIkon } from '@/asset/image/check.svg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import EksternLenke from '../../../komponenter/EksternLenke/EksternLenke';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../../messages';
import { useHentRefusjon } from '../../../services/rest-service';
import BEMHelper from '../../../utils/bem';
import { formatterPeriode } from '../../../utils/datoUtils';
import { formatterPenger } from '../../../utils/PengeUtils';
import TidligereRefusjonerForAvtale from '../../TidligereRefusjonerForAvtale/TidligereRefusjonerForAvtale';
import FordelingOversikt from '../InntektSteg/fordelingOversikt/FordelingOversikt';
import Utregning from '../OppsummeringSteg/Utregning';
import './KvitteringSteg.less';

type Props = {};

const cls = BEMHelper('kvitteringsteg');

const KvitteringSteg: FunctionComponent<Props> = (props) => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);

    if (!refusjon.beregning) {
        return null;
    }

    return (
        <div>
            <VerticalSpacer rem={2} />
            <Innholdstittel>Kvittering</Innholdstittel>
            <VerticalSpacer rem={2} />

            <div className={cls.element('gronn-boks')} role="note">
                <div style={{ marginRight: '1rem' }} aria-hidden={true}>
                    <CheckIkon />
                </div>
                <div>
                    <Element>
                        Du har søkt om refusjon for {refusjon.tilskuddsgrunnlag.deltakerFornavn}{' '}
                        {refusjon.tilskuddsgrunnlag.deltakerEtternavn}
                    </Element>
                    <VerticalSpacer rem={0.5} />
                    <Normaltekst>
                        Virksomheten vil få {formatterPenger(refusjon.beregning.refusjonsbeløp)} i refusjon av{' '}
                        {tiltakstypeTekst[refusjon.tilskuddsgrunnlag.tiltakstype]} for perioden{' '}
                        {formatterPeriode(
                            refusjon.tilskuddsgrunnlag.tilskuddFom,
                            refusjon.tilskuddsgrunnlag.tilskuddTom
                        )}
                        .
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <Normaltekst>
                        Pengene vil bli utbetalt til kontoen NAV har registrert på dere innen X virkedager.
                    </Normaltekst>
                    <VerticalSpacer rem={1} />

                    <EksternLenke href="https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/bankkontonummer-for-refusjoner-fra-nav-til-arbeidsgiver/">
                        Du kan sjekke hvilket kontonummer vi har registrert på dere her
                    </EksternLenke>
                </div>
            </div>

            <VerticalSpacer rem={1} />

            {/* <div className={cls.element('bla-boks')}>
                <div style={{ marginRight: '1rem' }}>
                    <InfoIkon />
                </div>
                <div>
                    <Element>Husk at dere må ... samme prosess når neste periode er fullført</Element>
                    <Normaltekst>Dere vil da få et varsel</Normaltekst>
                </div>
            </div> */}
            <VerticalSpacer rem={2} />

            <Ekspanderbartpanel
                tittel="Inntektsopplysninger"
                apen={false}
                aria-label="ekspanderbartpanel med inntektsopplysninger"
            >
                <FordelingOversikt
                    tilskuddsgrunnlag={refusjon.tilskuddsgrunnlag}
                    inntektsgrunnlag={refusjon.inntektsgrunnlag}
                />
            </Ekspanderbartpanel>

            <VerticalSpacer rem={1} />

            <Ekspanderbartpanel
                tittel="Utregning"
                apen={false}
                aria-label="ekspanderbartpanel med utregning opplysninger rundt refusjon"
            >
                <Utregning refusjon={refusjon} />
            </Ekspanderbartpanel>

            <VerticalSpacer rem={3} />
            <TidligereRefusjonerForAvtale refusjonId={refusjon.id} />
        </div>
    );
};

export default KvitteringSteg;
