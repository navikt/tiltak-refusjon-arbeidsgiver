import { BodyShort, Heading, HelpText, Table } from '@navikt/ds-react';
import React, { FunctionComponent, ReactNode } from 'react';
import { inntektBeskrivelse } from '../refusjon/RefusjonSide/inntektsmelding/InntekterFraAMeldingen';
import { Inntektslinje, Tilskuddsgrunnlag } from '../refusjon/refusjon';
import { formatterPenger } from '../utils/PengeUtils';
import BEMHelper from '../utils/bem';
import { NORSK_MÅNEDÅR_FORMAT, formatterDato, getMåned } from '../utils/datoUtils';
import { visSatsMedEttDesimal } from '../utils/utregningUtil';
import LesMerPanel from './LesMerPanel/LesMerPanel';
import './Utregningsrad.less';
import VerticalSpacer from './VerticalSpacer';

interface Props {
    labelIkon?: React.ReactNode;
    labelTekst: string | JSX.Element;
    labelSats?: number;
    verdiOperator?: string | ReactNode;
    verdi: number | string;
    ikkePenger?: boolean;
    border?: 'NORMAL' | 'TYKK' | 'INGEN';
    inntekter?: Inntektslinje[];
    tilskuddsgunnlag?: Tilskuddsgrunnlag;
}

const cls = BEMHelper('utregning-rad');

const Utregningsrad: FunctionComponent<Props> = (props: Props) => {
    const setIkon = (ikon?: React.ReactNode) =>
        ikon ? ikon : <div className={cls.element('ikon-placeholder')} aria-hidden={true} />;

    const setOperator = (operator?: string | ReactNode) =>
        operator ? (
            <Heading size="medium" className={cls.element('operator')}>
                {operator}
            </Heading>
        ) : null;

    const setLabelSats = (sats?: number) =>
        sats ? <BodyShort size="small">({visSatsMedEttDesimal(sats)}%)</BodyShort> : null;

    const border = () => {
        switch (props.border) {
            case 'NORMAL':
            case undefined:
                return '';
            case 'TYKK':
                return 'tykkbunn';
            case 'INGEN':
                return 'ingen-bunn';
            default:
                return '';
        }
    };

    const labelTekstString = typeof props.labelTekst === 'string' ? props.labelTekst : undefined;

    return (
        <div className={cls.element('utregning-wrapper', border())}>
            <div className={cls.element('utregning-rad', border())}>
                <div className={cls.element('utregning-label')}>
                    <div className={cls.element('label-innhold')}>
                        {setIkon(props.labelIkon)}
                        {<div id={labelTekstString}>{props.labelTekst}</div>}
                    </div>
                    {setLabelSats(props.labelSats)}
                </div>
                <div className={cls.element('utregning-verdi')}>
                    {setOperator(props.verdiOperator)}
                    <BodyShort size="small" className={cls.element('sum')} aria-labelledby={labelTekstString}>
                        {props.ikkePenger || typeof props.verdi === 'string'
                            ? props.verdi
                            : formatterPenger(props.verdi)}
                    </BodyShort>
                </div>
            </div>

            {props.inntekter && (
                <div style={{ marginLeft: '2rem' }}>
                    <LesMerPanel lukkLabel="Lukk" åpneLabel="Hva inngår i dette?">
                        <div>
                            <Table size="small">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Måned</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
                                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {props.inntekter.map((inntekt, i) => {
                                        const erFerietrekkForAnnenMåned =
                                            inntekt.beskrivelse === 'trekkILoennForFerie' &&
                                            getMåned(inntekt.måned) !==
                                                getMåned(props.tilskuddsgunnlag?.tilskuddFom || '');
                                        return (
                                            <Table.Row
                                                key={inntekt.id}
                                                style={{
                                                    textDecoration: erFerietrekkForAnnenMåned ? 'line-through' : '',
                                                }}
                                            >
                                                <Table.DataCell style={{ maxWidth: '10rem' }}>
                                                    {inntektBeskrivelse(inntekt.beskrivelse)}
                                                </Table.DataCell>
                                                <Table.DataCell>
                                                    {formatterDato(inntekt.måned, NORSK_MÅNEDÅR_FORMAT)}
                                                </Table.DataCell>
                                                <Table.DataCell>{formatterPenger(inntekt.beløp)}</Table.DataCell>
                                                <Table.DataCell>
                                                    {erFerietrekkForAnnenMåned && (
                                                        <HelpText>
                                                            Dette ferietrekket hører til en annen måned enn refusjonen
                                                            og vil ikke bli trukket her.
                                                        </HelpText>
                                                    )}
                                                </Table.DataCell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table>
                        </div>
                    </LesMerPanel>
                    <VerticalSpacer rem={1} />
                </div>
            )}
        </div>
    );
};

export default Utregningsrad;
