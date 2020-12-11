import { ReactComponent as CheckIkon } from '@/asset/image/check.svg';
import { ReactComponent as InfoIkon } from '@/asset/image/info.svg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import EksternLenke from '../../../komponenter/EksternLenke/EksternLenke';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import { useHentRefusjon } from '../../../services/rest-service';
import BEMHelper from '../../../utils/bem';
import { formatterPenger } from '../../../utils/PengeUtils';
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

            <div className={cls.element('gronn-boks')}>
                <div style={{ marginRight: '1rem' }}>
                    <CheckIkon />
                </div>
                <div>
                    <Element>Du har bedt om refusjon for Navn Navnesen </Element>
                    <Normaltekst>
                        Virksomheten vil få {formatterPenger(refusjon.beregning.refusjonsbeløp)} i refusjon av
                        midlertidig lønnstilksudd for perioden 15. april til 15. juli.
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <Normaltekst>
                        Pengene vil bli utbetalt til konoten NAV har registrert på dere innen X virkedager. Det vil bli
                        trukket skatt av pengene, så beløpet vil bli lavere{' '}
                        {formatterPenger(refusjon.beregning.refusjonsbeløp)}.
                    </Normaltekst>
                    <VerticalSpacer rem={1} />

                    <EksternLenke href="">Du kan sjekke hvilket kontonummer vi har registrert på dere her</EksternLenke>
                </div>
            </div>

            <VerticalSpacer rem={1} />

            <div className={cls.element('bla-boks')}>
                <div style={{ marginRight: '1rem' }}>
                    <InfoIkon />
                </div>
                <div>
                    <Element>Husk at dere må ... samme prosess når neste periode er fullført </Element>
                    <Normaltekst>Dere vil da få et varsel bla bla bla</Normaltekst>
                </div>
            </div>
            <VerticalSpacer rem={1} />

            <Ekspanderbartpanel tittel="Se tidligere refusjoner for dette tiltaket">
                Forrige periode: 15. januar til 15. april (?????)
            </Ekspanderbartpanel>
        </div>
    );
};

export default KvitteringSteg;