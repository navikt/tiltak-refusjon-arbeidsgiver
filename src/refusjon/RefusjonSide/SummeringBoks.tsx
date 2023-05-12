import { ReactComponent as Pengesedler } from '@/asset/image/pengesedler.svg';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjonsgrunnlag } from '../refusjon';
import { RefusjonStatus } from '../status';

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
    status: RefusjonStatus;
};

const SummeringBoks: FunctionComponent<Props> = (props) => {
    if (props.refusjonsgrunnlag.beregning?.refusjonsbeløp === undefined) {
        return null;
    }

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

            {props.refusjonsgrunnlag.beregning?.refusjonsbeløp === 0 && (
                <div>
                    <VerticalSpacer rem={0.5} />
                    <Normaltekst>
                        {props.status === 'KLAR_FOR_INNSENDING' &&
                            props.refusjonsgrunnlag.beregning.sumUtgifter !==
                                props.refusjonsgrunnlag.beregning?.sumUtgifterFratrukketRefundertBeløp && (
                                <>
                                    <Normaltekst>
                                        Oppgitt refunderbar lønn{' '}
                                        <b>
                                            (
                                            {formatterPenger(
                                                props.refusjonsgrunnlag.beregning?.tidligereRefundertBeløp
                                            )}
                                            )
                                        </b>{' '}
                                        gir et negativt refusjonsgrunnlag og refusjonsbeløpet settes da til{' '}
                                        {formatterPenger(0)}.
                                    </Normaltekst>
                                    <VerticalSpacer rem={0.5} />
                                    <Element>
                                        Godta{' '}
                                        <b>{formatterPenger(props.refusjonsgrunnlag.beregning?.refusjonsbeløp || 0)}</b>{' '}
                                        for perioden{' '}
                                        {formatterPeriode(
                                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                                        )}{' '}
                                        ved å trykke fullfør under.
                                    </Element>
                                </>
                            )}
                        {props.status !== 'KLAR_FOR_INNSENDING' && (
                            <>
                                <Element>
                                    Refusjonen er godtatt med {formatterPenger(0)} for perioden{' '}
                                    {formatterPeriode(
                                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                                    )}
                                </Element>
                            </>
                        )}
                    </Normaltekst>
                </div>
            )}

            {props.refusjonsgrunnlag.beregning?.refusjonsbeløp < 0 && (
                <div>
                    {props.refusjonsgrunnlag.beregning.lønnFratrukketFerie < 0 && (
                        <>
                            <Normaltekst>
                                Siden fratrekk for ferie er større enn bruttolønn i perioden vil det negative
                                refusjonsbeløpet overføres til neste periode. Om tiltaket avsluttes, vil det negative
                                refusjonsbeløpet ikke overføres til neste periode.
                            </Normaltekst>
                            <VerticalSpacer rem={0.5} />
                            <Normaltekst>
                                {props.refusjonsgrunnlag.beregning.sumUtgifter !==
                                    props.refusjonsgrunnlag.beregning?.sumUtgifterFratrukketRefundertBeløp && (
                                    <>
                                        Vi tar ikke hensyn til oppgitt refunderbar lønn (
                                        {formatterPenger(props.refusjonsgrunnlag.beregning?.tidligereRefundertBeløp)})
                                        ved negativt refusjonsbeløp. Dette er altså ikke med i beregnet refusjonsbeløp.{' '}
                                    </>
                                )}
                            </Normaltekst>
                            <VerticalSpacer rem={0.5} />
                            <Element>
                                {props.status === 'KLAR_FOR_INNSENDING' && 'Dere må fortsatt trykke fullfør under.'}
                            </Element>
                        </>
                    )}
                    <VerticalSpacer rem={0.5} />
                    <Normaltekst>
                        Dere skylder{' '}
                        <b>{formatterPenger(Math.abs(props.refusjonsgrunnlag.beregning?.refusjonsbeløp || 0))}</b> for
                        perioden{' '}
                        {formatterPeriode(
                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                        )}
                        . Dette vil trekkes fra neste refusjon.
                    </Normaltekst>
                </div>
            )}
        </Boks>
    );
};

export default SummeringBoks;
