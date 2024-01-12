import Pengesedler from '@/asset/image/pengesedler.svg?react';
import { Label, BodyShort } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjonsgrunnlag, Tilskuddsgrunnlag } from '../refusjon';
import { RefusjonStatus } from '../status';
import Boks from '../../komponenter/Boks/Boks';

type Props = {
    refusjonsgrunnlag: Refusjonsgrunnlag;
    status: RefusjonStatus;
};

// Dersom vi vet at dette er siste tilskuddsperiode så vil vi vise alternativ tekst
// som indikerer at man ikke behøver å tilbakebetale beløpet man skylder (med mindre avtale forlenges)
const erSisteTilskuddsperiodeIAvtalen = (tilskuddsgrunnlag: Tilskuddsgrunnlag) =>
    tilskuddsgrunnlag.avtaleTom === tilskuddsgrunnlag.tilskuddTom;

const SummeringBoks: FunctionComponent<Props> = (props) => {
    if (props.refusjonsgrunnlag.beregning?.refusjonsbeløp === undefined) {
        return null;
    }

    return (
        <Boks variant="blå">
            <div style={{ paddingRight: '1.5rem' }}>
                <Pengesedler />
            </div>
            {props.refusjonsgrunnlag.beregning?.refusjonsbeløp > 0 && (
                <div>
                    <Label>Dere får utbetalt</Label>
                    <VerticalSpacer rem={0.5} />
                    <BodyShort size="small">
                        <b>{formatterPenger(props.refusjonsgrunnlag.beregning?.refusjonsbeløp || 0)}</b> for perioden{' '}
                        {formatterPeriode(
                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                        )}{' '}
                        til kontonummer {props.refusjonsgrunnlag.bedriftKontonummer}
                    </BodyShort>
                </div>
            )}

            {props.refusjonsgrunnlag.beregning?.refusjonsbeløp === 0 && (
                <div>
                    <VerticalSpacer rem={0.5} />
                    <BodyShort size="small">
                        {props.status === 'KLAR_FOR_INNSENDING' &&
                            props.refusjonsgrunnlag.beregning.sumUtgifter !==
                                props.refusjonsgrunnlag.beregning?.sumUtgifterFratrukketRefundertBeløp && (
                                <>
                                    <BodyShort size="small">
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
                                    </BodyShort>
                                    <VerticalSpacer rem={0.5} />
                                    <Label>
                                        Godta{' '}
                                        <b>{formatterPenger(props.refusjonsgrunnlag.beregning?.refusjonsbeløp || 0)}</b>{' '}
                                        for perioden{' '}
                                        {formatterPeriode(
                                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                                            props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                                        )}{' '}
                                        ved å trykke fullfør under.
                                    </Label>
                                </>
                            )}
                        {props.status !== 'KLAR_FOR_INNSENDING' && (
                            <>
                                <Label>
                                    Refusjonen er godtatt med {formatterPenger(0)} for perioden{' '}
                                    {formatterPeriode(
                                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                                    )}
                                </Label>
                            </>
                        )}
                    </BodyShort>
                </div>
            )}

            {props.refusjonsgrunnlag.beregning?.refusjonsbeløp < 0 && (
                <div>
                    {props.refusjonsgrunnlag.beregning.lønnFratrukketFerie < 0 && (
                        <>
                            {erSisteTilskuddsperiodeIAvtalen(props.refusjonsgrunnlag.tilskuddsgrunnlag) ? (
                                <BodyShort size="small">
                                    Fratrekk for ferie er større enn bruttolønn i perioden. Ettersom tiltaket er
                                    avsluttet vil dette beløpet bli sett bort fra.
                                    <br />
                                    Dersom tiltaket forlenges vil beløpet trekkes fra neste periode.
                                </BodyShort>
                            ) : (
                                <BodyShort size="small">
                                    Siden fratrekk for ferie er større enn bruttolønn i perioden vil det negative
                                    refusjonsbeløpet overføres til neste periode.
                                </BodyShort>
                            )}

                            <VerticalSpacer rem={0.5} />
                            <BodyShort size="small">
                                {props.refusjonsgrunnlag.beregning.sumUtgifter !==
                                    props.refusjonsgrunnlag.beregning?.sumUtgifterFratrukketRefundertBeløp && (
                                    <>
                                        Vi tar ikke hensyn til oppgitt refunderbar lønn (
                                        {formatterPenger(props.refusjonsgrunnlag.beregning?.tidligereRefundertBeløp)})
                                        ved negativt refusjonsbeløp. Dette er altså ikke med i beregnet refusjonsbeløp.{' '}
                                    </>
                                )}
                            </BodyShort>
                            <VerticalSpacer rem={0.5} />
                            <Label>
                                {props.status === 'KLAR_FOR_INNSENDING' && 'Dere må fortsatt trykke fullfør under.'}
                            </Label>
                        </>
                    )}
                    <VerticalSpacer rem={0.5} />
                    {erSisteTilskuddsperiodeIAvtalen(props.refusjonsgrunnlag.tilskuddsgrunnlag) ? (
                        <BodyShort size="small">
                            Dere skylder{' '}
                            <b style={{ textDecoration: 'line-through' }}>
                                {formatterPenger(Math.abs(props.refusjonsgrunnlag.beregning?.refusjonsbeløp || 0))}
                            </b>{' '}
                            <b>{formatterPenger(0)}</b> for perioden{' '}
                            {formatterPeriode(
                                props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                                props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                            )}
                            .
                        </BodyShort>
                    ) : (
                        <BodyShort size="small">
                            Dere skylder{' '}
                            <b>{formatterPenger(Math.abs(props.refusjonsgrunnlag.beregning?.refusjonsbeløp || 0))}</b>{' '}
                            for perioden{' '}
                            {formatterPeriode(
                                props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                                props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                            )}
                            . Dette vil trekkes fra neste refusjon.
                        </BodyShort>
                    )}
                </div>
            )}
        </Boks>
    );
};

export default SummeringBoks;
