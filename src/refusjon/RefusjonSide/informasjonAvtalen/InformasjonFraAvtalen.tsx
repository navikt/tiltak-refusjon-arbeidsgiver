import { Calender, File, FileContent, Money, People, Warning } from '@navikt/ds-icons';
import KIDInputValidator from '../../../komponenter/KIDInputValidator/KIDInputValidator';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import EksternLenke from '../../../komponenter/EksternLenke/EksternLenke';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../../messages';
import { hentBedriftkontonummer, useHentRefusjon } from '../../../services/rest-service';
import { formatterDato, formatterPeriode } from '../../../utils/datoUtils';
import { formatterPenger } from '../../../utils/PengeUtils';
import { Alert, Heading, Label, BodyShort } from '@navikt/ds-react';
import useSWRMutation from 'swr/mutation';

const IkonRad = styled.div`
    display: flex;
    * {
        margin-right: 0.5rem;
    }
`;

const GråBoks = styled.div`
    background-color: #f7f7f7;
    border-radius: 4px;
    padding: 1.5rem;
`;

const InformasjonFraAvtalen: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const initialized = useRef(false);
    const { trigger, isMutating } = useSWRMutation(`/refusjon/${refusjonId}`, hentBedriftkontonummer);

    const avtaleLenke = `http://arbeidsgiver.nav.no/tiltaksgjennomforing/avtale/${refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.avtaleId}`;

    const refusjonsnummer = `${refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.avtaleNr}-${refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.løpenummer}`;

    useEffect(() => {
        if (!initialized.current) {
            if (!refusjon.refusjonsgrunnlag.bedriftKontonummer && !isMutating) {
                //trigger(refusjon.sistEndret);
                initialized.current = true;
            }
        }
    }, [isMutating, refusjon.refusjonsgrunnlag.bedriftKontonummer, refusjon.sistEndret, trigger]);

    return (
        <GråBoks>
            <Heading size="small">Informasjon hentet fra avtalen</Heading>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <EksternLenke href={avtaleLenke}>
                    <File />
                    Avtale om {tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]}
                </EksternLenke>
            </IkonRad>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <File />
                <Label>Refusjonsnummer: </Label>
                <BodyShort size="small">{refusjonsnummer}</BodyShort>
            </IkonRad>
            <VerticalSpacer rem={1} />
            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.arbeidsgiverFornavn && (
                <>
                    <IkonRad>
                        <People />
                        <Label>Arbeidsgiver: </Label>
                        <BodyShort size="small">
                            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.arbeidsgiverFornavn}{' '}
                            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.arbeidsgiverEtternavn}
                        </BodyShort>
                        <Label>Mobil: </Label>
                        <BodyShort size="small">
                            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.arbeidsgiverTlf}
                        </BodyShort>
                    </IkonRad>
                    <VerticalSpacer rem={1} />
                </>
            )}
            <IkonRad>
                <People />
                <Label>Deltaker: </Label>
                <BodyShort size="small">
                    {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.deltakerFornavn}{' '}
                    {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.deltakerEtternavn}
                </BodyShort>
            </IkonRad>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <Calender />
                <Label>Periode: </Label>
                <BodyShort size="small">
                    {formatterPeriode(
                        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                    )}
                </BodyShort>
            </IkonRad>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <Warning />
                <Label>Frist: </Label>
                <BodyShort size="small">{formatterDato(refusjon.fristForGodkjenning)}</BodyShort>
            </IkonRad>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <FileContent />
                <Label>Avtalt beløp for perioden:</Label>
                <BodyShort size="small">
                    Inntil {formatterPenger(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddsbeløp)}
                </BodyShort>
            </IkonRad>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <Money />
                <Label>Kontonummer:</Label>
                <BodyShort size="small">{refusjon.refusjonsgrunnlag.bedriftKontonummer}</BodyShort>
            </IkonRad>
            {(!refusjon.refusjonsgrunnlag.bedriftKid || refusjon.refusjonsgrunnlag.bedriftKid.trim().length === 0) &&
            refusjon.status !== 'KLAR_FOR_INNSENDING' ? (
                <></>
            ) : (
                <>
                    <VerticalSpacer rem={1} />
                    <IkonRad>
                        <Money />
                        <Label>KID:</Label>
                        {refusjon.status === 'KLAR_FOR_INNSENDING' ? (
                            <>
                                <KIDInputValidator />
                                <BodyShort size="small">(Dette feltet er valgfritt)</BodyShort>
                            </>
                        ) : (
                            <BodyShort size="small">{refusjon.refusjonsgrunnlag.bedriftKid}</BodyShort>
                        )}
                    </IkonRad>
                </>
            )}

            {refusjon.refusjonsgrunnlag.bedriftKontonummer === null && refusjon.åpnetFørsteGang && (
                <>
                    <VerticalSpacer rem={1} />
                    <Alert variant="error" size="small">
                        Vi kan ikke finne noe kontonummer på deres virksomhet. Riktig kontonummer må{' '}
                        <EksternLenke href="https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/bankkontonummer-for-refusjoner-fra-nav-til-arbeidsgiver/">
                            sendes inn via Altinn.
                        </EksternLenke>
                    </Alert>
                </>
            )}
        </GråBoks>
    );
};

export default InformasjonFraAvtalen;
