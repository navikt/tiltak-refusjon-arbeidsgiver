import { ReactComponent as Pengesedler } from '@/asset/image/pengesedler.svg';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjonsgrunnlag } from '../refusjon';

const Boks = styled.div`
    display: flex;
    flex-direction: row;
    border: 3px solid #cce1f3;
    border-radius: 4px;
    padding: 1.75rem;
    margin-bottom: 1rem;
`;

type Props = {
    refusjonsgrunnlag: Refusjonsgrunnlag;
};

const SummeringBoks: FunctionComponent<Props> = (props) => {
    if (
        props.refusjonsgrunnlag.beregning?.refusjonsbeløp === undefined ||
        props.refusjonsgrunnlag.beregning?.refusjonsbeløp === 0
    ) {
        return null;
    }

    const hentStatusTittelMeldingOmDetErDenSisteRefusjonen = () => {
        if (
            props.refusjonsgrunnlag.beregning?.lønnFratrukketFerie != undefined &&
            props.refusjonsgrunnlag.beregning?.lønnFratrukketFerie >= 0
        )
            return 'Dere skylder';
        const sisteAvtaleDatoTOM = new Date(props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);
        const idag = new Date();
        const sisteSetning = ' Dere må fortsatt trykke fullfør under.';
        return (
            (sisteAvtaleDatoTOM.getMonth() !== idag.getMonth() &&
            sisteAvtaleDatoTOM.getFullYear() !== idag.getFullYear()
                ? 'Siden fratrekk for ferie er større enn bruttolønn i perioden vil det negative refusjonsbeløpet overføres til neste periode.  '
                : 'Siden fratrekk for ferie er større enn bruttolønn i perioden vil det ikke bli utbetalt refusjon. Siden tiltaket avsluttes, vil det negative refusjonsbeløpet ikke overføres til neste periode. ') +
            sisteSetning
        );
    };

    return (
        <Boks>
            <div style={{ paddingRight: '1.5rem' }}>
                <Pengesedler />
            </div>
            {props.refusjonsgrunnlag.beregning?.refusjonsbeløp > 0 && (
                <div>
                    <Element>Dere får utbetalt</Element>
                    <VerticalSpacer rem={0.5} />
                    <Normaltekst>
                        <b>{formatterPenger(props.refusjonsgrunnlag.beregning?.refusjonsbeløp || 0)}</b> for perioden{' '}
                        {formatterPeriode(
                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                        )}{' '}
                        til kontonummer {props.refusjonsgrunnlag.bedriftKontonummer}
                    </Normaltekst>
                </div>
            )}
            {props.refusjonsgrunnlag.beregning?.refusjonsbeløp < 0 && (
                <div>
                    <Element> {hentStatusTittelMeldingOmDetErDenSisteRefusjonen()}</Element>
                    <VerticalSpacer rem={0.5} />
                    <Normaltekst>
                        <b>{formatterPenger(Math.abs(props.refusjonsgrunnlag.beregning?.refusjonsbeløp || 0))}</b> for
                        perioden{' '}
                        {formatterPeriode(
                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                        )}
                    </Normaltekst>
                </div>
            )}
        </Boks>
    );
};

export default SummeringBoks;
