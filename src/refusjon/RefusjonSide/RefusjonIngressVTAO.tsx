import React, { FunctionComponent, PropsWithChildren } from 'react';
import { storForbokstav } from '../../utils/stringUtils';
import { statusTekst } from '../../messages';
import { formatterDato, NORSK_DATO_OG_TID_FORMAT } from '../../utils/datoUtils';
import EksternLenke from '../../komponenter/EksternLenke/EksternLenke';
import { Refusjon } from '../refusjon';
import BEMHelper from '../../utils/bem';
import { Tag, BodyShort, Heading } from '@navikt/ds-react';

interface Properties {
    refusjon: Refusjon;
}

const RefusjonIngress: FunctionComponent<Properties> = ({ refusjon }: PropsWithChildren<Properties>) => {
    const cls = BEMHelper('refusjonside');
    return (
        <>
            <div className={cls.element('ingress')}>
                <Heading level="1" size="large" role="heading">
                    Refusjon for varig tilrettelagt arbeid oppfølging
                </Heading>
                {/*
                <Tag variant="info" size="small">
                    {storForbokstav(statusTekst[refusjon.status])}{' '}
                    {refusjon.godkjentAvArbeidsgiver &&
                        formatterDato(refusjon.godkjentAvArbeidsgiver, NORSK_DATO_OG_TID_FORMAT)}
                </Tag>
                */}
            </div>
            {/*
            <BodyShort size="small" className={cls.element('ingress-text')}>
                Vi henter inntektsopplysninger for deltakeren fra a-meldingen automatisk. A-meldingen er en månedlig
                melding fra arbeidsgiver til NAV, SSB og Skatteetaten om ansattes inntekt, arbeidsforhold og
                forskuddstrekk, samt arbeidsgiveravgift og finansskatt for virksomheten. Hvis inntektsopplysningene ikke
                stemmer så må det{' '}
                <EksternLenke href={'https://www.altinn.no/skjemaoversikt/a-ordningen/a-melding2/'}>
                    oppdateres i ditt lønnssystem.
                </EksternLenke>
                Feriepenger, innskudd obligatorisk tjenestepensjon, arbeidsgiveravgiften og lønnstilskuddsprosenten er
                hentet fra avtalen om midlertidig lønnstilskudd.
            </BodyShort>
            <BodyShort size="small" className={cls.element('ingress-text-refusjon')}>
                Siste frist for å sende inn kravet er senest to måneder etter at perioden er over. Hvis fristen ikke
                holdes, trekkes tilskuddet som er innvilget og dere får ikke utbetalt støtte.
            </BodyShort>
            */}
        </>
    );
};
export default RefusjonIngress;
