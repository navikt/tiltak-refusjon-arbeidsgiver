import { BodyShort, Heading } from '@navikt/ds-react';
import React, { FunctionComponent, ReactNode } from 'react';
import { Inntektslinje, Tilskuddsgrunnlag } from '../refusjon/refusjon';
import { formatterPenger } from '../utils/PengeUtils';
import BEMHelper from '../utils/bem';
import { visSatsMedEttDesimal } from '../utils/utregningUtil';
import './Utregningsrad.less';
import UtregningsradHvaInngårIDette from './UtregningsradHvaInngårIDette';
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
                <>
                    <UtregningsradHvaInngårIDette
                        inntekter={props.inntekter}
                        tilskuddsgrunnlag={props.tilskuddsgunnlag}
                    />
                    <VerticalSpacer rem={1} />
                </>
            )}
        </div>
    );
};

export default Utregningsrad;
