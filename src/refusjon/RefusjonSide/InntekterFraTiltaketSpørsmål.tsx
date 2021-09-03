import React, { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router';
import { korrigerBruttolønn, useHentRefusjon } from '../../services/rest-service';
import { Undertittel } from 'nav-frontend-typografi';
import { tiltakstypeTekst } from '../../messages';
import { Input, Label, RadioPanel } from 'nav-frontend-skjema';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { formatterPenger } from '../../utils/PengeUtils';

const RadioPakning = styled.div`
    display: flex;
    flex-direction: row;
    label {
        flex-grow: 1;
        margin-right: 0.5rem;
        &:last-child {
            margin-right: 0;
        }
    }
`;

const InntekterFraTiltaketSpørsmål: FunctionComponent = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);
    const [inntekterKunFraTiltaket, setInntekterKunFraTiltaket] = useState(refusjon.inntekterKunFraTiltaket);
    const [korrigertBruttoLønn, setKorrigertBruttoLønn] = useState(refusjon.korrigertBruttoLønn);
    if (refusjon.inntektsgrunnlag === undefined) {
        return null;
    }
    const bruttoLønn = refusjon.inntektsgrunnlag.bruttoLønn;

    const svarPåSpørsmål = (checked: boolean) => {
        setInntekterKunFraTiltaket(checked);
        if (checked) {
            setKorrigertBruttoLønn(undefined);
            korrigerBruttolønn(refusjonId, checked, undefined);
        } else {
            // korrigerBruttolønn(refusjonId, checked, korrigertBruttoLønn)
        }
    };

    return (
        <div>
            <Undertittel>Inntekter fra {tiltakstypeTekst[refusjon.tilskuddsgrunnlag.tiltakstype]}</Undertittel>
            <VerticalSpacer rem={1} />
            <Label htmlFor={'inntekterKunFraTiltaket'}>
                Er inntektene som vi har hentet ({formatterPenger(refusjon.inntektsgrunnlag.bruttoLønn)}) kun fra
                tiltaket {tiltakstypeTekst[refusjon.tilskuddsgrunnlag.tiltakstype]}?
            </Label>
            <p>
                <i>Du skal svare "nei" hvis noen av inntektene er fra f. eks. vanlig lønn eller lønnstilskudd</i>
            </p>
            <RadioPakning>
                <RadioPanel
                    name="inntekterKunFraTiltaket"
                    label="Ja"
                    value={'ja'}
                    checked={inntekterKunFraTiltaket === true}
                    onChange={() => svarPåSpørsmål(true)}
                />
                <RadioPanel
                    name="inntekterKunFraTiltaket"
                    label="Nei"
                    value={'nei'}
                    checked={inntekterKunFraTiltaket === false}
                    onChange={() => svarPåSpørsmål(false)}
                />
            </RadioPakning>
            {inntekterKunFraTiltaket === false && (
                <>
                    <VerticalSpacer rem={1} />
                    <Input
                        bredde={'S'}
                        label={`Skriv inn bruttolønn utbetalt for ${
                            tiltakstypeTekst[refusjon.tilskuddsgrunnlag.tiltakstype]
                        }`}
                        onChange={(event: any) => {
                            const verdi = event.currentTarget.value;
                            if (verdi.match(/^\d*$/) && verdi <= bruttoLønn) {
                                setKorrigertBruttoLønn(verdi as number);
                            }
                        }}
                        onBlur={() => korrigerBruttolønn(refusjonId, false, korrigertBruttoLønn)}
                        value={korrigertBruttoLønn}
                    />
                </>
            )}
        </div>
    );
};

export default InntekterFraTiltaketSpørsmål;
