import { Input, Label, RadioPanel } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { endreBruttolønn, useHentRefusjon } from '../../services/rest-service';
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
    const [inntekterKunFraTiltaket, setInntekterKunFraTiltaket] = useState(refusjon.refusjonsgrunnlag.inntekterKunFraTiltaket);
    const [endretBruttoLønn, setEndretBruttoLønn] = useState(refusjon.refusjonsgrunnlag.endretBruttoLønn);
    if (refusjon.refusjonsgrunnlag.inntektsgrunnlag === undefined) {
        return null;
    }
    const bruttoLønn = refusjon.refusjonsgrunnlag.inntektsgrunnlag.bruttoLønn;

    const svarPåSpørsmål = (checked: boolean) => {
        setInntekterKunFraTiltaket(checked);
        if (checked) {
            setEndretBruttoLønn(undefined);
            endreBruttolønn(refusjonId!, checked, undefined);
        }
    };

    return (
        <div>
            <Undertittel>
                Inntekter fra {tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]}
            </Undertittel>
            <VerticalSpacer rem={1} />

            <Label htmlFor={'inntekterKunFraTiltaket'}>
                Er inntektene som vi har hentet{' '}
                {refusjon.refusjonsgrunnlag.inntektsgrunnlag.bruttoLønn > 0 && (
                    <>({formatterPenger(refusjon.refusjonsgrunnlag.inntektsgrunnlag.bruttoLønn)})</>
                )}{' '}
                kun fra tiltaket {tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]}?
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
                            tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]
                        }`}
                        onChange={(event: any) => {
                            const verdi = event.currentTarget.value;
                            if (verdi.match(/^\d*$/) && verdi <= bruttoLønn) {
                                setEndretBruttoLønn(verdi as number);
                            }
                        }}
                        onBlur={() => endreBruttolønn(refusjonId!, false, endretBruttoLønn)}
                        value={endretBruttoLønn}
                    />
                </>
            )}
        </div>
    );
};

export default InntekterFraTiltaketSpørsmål;
