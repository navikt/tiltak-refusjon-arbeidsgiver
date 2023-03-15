import React, { ChangeEvent, FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import LesMerPanel from '../../komponenter/LesMerPanel/LesMerPanel';
import BEMHelper from '../../utils/bem';
import { Input, RadioPanel } from 'nav-frontend-skjema';
import { Refusjon } from '../refusjon';
import { sumInntekterOpptjentIPeriode } from '../../utils/inntekterUtiles';
import { settTidligereRefunderbarBeløp, utsettFriskSykepenger } from '../../services/rest-service';
import { useParams } from 'react-router';
import { formatterDato } from '../../utils/datoUtils';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

interface Properties {
    refusjon: Refusjon;
}

const TidligereRefunderbarBeløp: FunctionComponent<Properties> = ({ refusjon }: PropsWithChildren<Properties>) => {
    const { refusjonId } = useParams();
    const { inntektsgrunnlag, inntekterKunFraTiltaket, fratrekkRefunderbarBeløp, beregning } =
        refusjon.refusjonsgrunnlag;
    const [fratrekk, setFratrekk] = useState<boolean | undefined>(fratrekkRefunderbarBeløp);
    const [belop, setBelop] = useState<string>(beregning?.tidligereRefundertBeløp?.toString() ?? '');

    useEffect(() => {
        setFratrekk(fratrekkRefunderbarBeløp);
    }, [fratrekkRefunderbarBeløp]);
    if (
        inntektsgrunnlag === undefined ||
        !refusjon.harTattStillingTilAlleInntektslinjer ||
        inntekterKunFraTiltaket === null
    ) {
        return null;
    }

    const utsettFristForRefusjon = async (): Promise<void> => {
        try {
            await utsettFriskSykepenger(refusjon.id);
        } catch(e) {}
    };

    const sumInntekterOpptjent: number = sumInntekterOpptjentIPeriode(inntektsgrunnlag);
    const cls = BEMHelper('refusjonside');
    return (
        <div className={cls.element('fratrekk-sykepenger')}>
            <Undertittel className={cls.element('fratrekk-sykepenger-tittel')}>Fravær i perioden</Undertittel>
            <div className={cls.element('fratrekk-sykepenger-txt')}>
                <Normaltekst>
                    Har dere fått utbetalt refusjon av lønn på grunn av fravær for deltaker, for eksempel refusjon av
                    sykepenger, så skal dette beløpet trekkes fra refusjon om lønnstilskudd. Beløpet som skal trekkes
                    fra er det beløpet dere har fått i refusjon av NAV.
                </Normaltekst>
                <VerticalSpacer rem={0.5}/>
                <Normaltekst >
                    Har dere søkt om refusjon for fravær og venter på rett beløp så må dere vente med å fylle ut refusjon for {tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]}.
                    Fristen vil automatisk utsettes 6 mnd fremover i tid mens dere venter på rett beløp.
                </Normaltekst>
            </div>
            <AlertStripeInfo >
                Refusjon av utbetalt lønn kan være aktuelt dersom dere har søkt om, eller fått utbetalt, refusjon
                for sykepenger / foreldrepenger / svangerskapspenger / opplæringspenger / pleiepenger, eller hvis
                detalker har vært fraværende på grunn av egen eller barns sykdom i denne perioden.
            </AlertStripeInfo>
            <VerticalSpacer rem={1.75}/>
            <Element>Har deltaker hatt fravær med lønn som blir refundert av NAV i denne perioden?</Element>
            <div className={cls.element('fratrekk-sykepenger-radiogroup')}>
                <RadioPanel
                    name=""
                    label="Ja"
                    checked={fratrekk === true}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setFratrekk(event.currentTarget.checked);
                        utsettFristForRefusjon()
                    }}
                />
                <RadioPanel
                    name=""
                    label="Nei"
                    checked={fratrekk === false}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setFratrekk(!event.currentTarget.checked);
                        setBelop('');
                        settTidligereRefunderbarBeløp(refusjonId!, false, undefined);
                    }}
                />
                {fratrekk === true && <Normaltekst className={cls.element('ny-frist')}>Ny frist for å søke refusjon: <strong>{formatterDato(refusjon.fristForGodkjenning)}</strong></Normaltekst>}
            </div>
            {fratrekk === true && (
                <>
                    <Input
                        bredde={'S'}
                        label={`Refusjonsbeløpet på grunn av fravær`}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const verdi: string = event.currentTarget.value;
                            if (verdi.match(/^\d*$/) && parseInt(verdi, 10) <= sumInntekterOpptjent) setBelop(verdi);
                        }}
                        onBlur={() => settTidligereRefunderbarBeløp(refusjonId!, true, parseInt(belop, 10))}
                        value={belop}
                        />
                </>
            )}
        </div>
    );
};
export default TidligereRefunderbarBeløp;
