import { Calender, File, FileContent, Money, People, Warning } from '@navikt/ds-icons';
import KIDInputValidator from '../../../komponenter/KIDInputValidator/KIDInputValidator';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import EksternLenke from '../../../komponenter/EksternLenke/EksternLenke';
import VerticalSpacer from '../../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../../messages';
import { useHentRefusjon } from '../../../services/rest-service';
import { formatterDato, formatterPeriode } from '../../../utils/datoUtils';
import { formatterPenger } from '../../../utils/PengeUtils';
import { Alert } from '@navikt/ds-react';

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

    const avtaleLenke = `http://arbeidsgiver.nav.no/tiltaksgjennomforing/avtale/${refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.avtaleId}`;

    const refusjonsnummer = `${refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.avtaleNr}-${refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.løpenummer}`;

    return (
        <GråBoks>
            <Undertittel>Informasjon hentet fra avtalen</Undertittel>
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
                <Element>Refusjonsnummer: </Element>
                <Normaltekst>{refusjonsnummer}</Normaltekst>
            </IkonRad>
            <VerticalSpacer rem={1} />
            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.arbeidsgiverFornavn && (
                <>
                    <IkonRad>
                        <People />
                        <Element>Arbeidsgiver: </Element>
                        <Normaltekst>
                            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.arbeidsgiverFornavn}{' '}
                            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.arbeidsgiverEtternavn}
                        </Normaltekst>
                        <Element>Mobil: </Element>
                        <Normaltekst>{refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.arbeidsgiverTlf}</Normaltekst>
                    </IkonRad>
                    <VerticalSpacer rem={1} />
                </>
            )}
            <IkonRad>
                <People />
                <Element>Deltaker: </Element>
                <Normaltekst>
                    {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.deltakerFornavn}{' '}
                    {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.deltakerEtternavn}
                </Normaltekst>
            </IkonRad>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <Calender />
                <Element>Periode: </Element>
                <Normaltekst>
                    {formatterPeriode(
                        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                        refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                    )}
                </Normaltekst>
            </IkonRad>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <Warning />
                <Element>Frist: </Element>
                <Normaltekst>{formatterDato(refusjon.fristForGodkjenning)}</Normaltekst>
            </IkonRad>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <FileContent />
                <Element>Avtalt beløp for perioden:</Element>
                <Normaltekst>
                    Inntil {formatterPenger(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddsbeløp)}
                </Normaltekst>
            </IkonRad>
            <VerticalSpacer rem={1} />
            <IkonRad>
                <Money />
                <Element>Kontonummer:</Element>
                <Normaltekst>{refusjon.refusjonsgrunnlag.bedriftKontonummer}</Normaltekst>
            </IkonRad>
            {(!refusjon.refusjonsgrunnlag.bedriftKid || refusjon.refusjonsgrunnlag.bedriftKid.trim().length === 0) &&
            refusjon.status !== 'KLAR_FOR_INNSENDING' ? (
                <></>
            ) : (
                <>
                    <VerticalSpacer rem={1} />
                    <IkonRad>
                        <Money />
                        <Element>KID:</Element>
                        {refusjon.status === 'KLAR_FOR_INNSENDING' ? (
                            <>
                                <KIDInputValidator />
                                <Normaltekst>(Dette feltet er valgfritt)</Normaltekst>
                            </>
                        ) : (
                            <Normaltekst>{refusjon.refusjonsgrunnlag.bedriftKid}</Normaltekst>
                        )}
                    </IkonRad>
                </>
            )}

            {refusjon.refusjonsgrunnlag.bedriftKontonummer === null && (
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
