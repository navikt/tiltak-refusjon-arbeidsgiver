import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import React, { FunctionComponent, ReactNode } from 'react';
import BEMHelper from '../utils/bem';
import { visSatsMedEttDesimal } from '../utils/utregningUtil';
import { formatterPenger } from '../utils/PengeUtils';
import './Utregningsrad.less';

interface Props {
    labelIkon?: React.ReactNode;
    labelTekst: string | JSX.Element;
    labelSats?: number;
    verdiOperator?: string | ReactNode;
    verdi: number | string;
    ikkePenger?: boolean;
    border?: 'NORMAL' | 'TYKK' | 'INGEN';
}

const cls = BEMHelper('utregning-rad');

const Utregningsrad: FunctionComponent<Props> = (props: Props) => {
    const setIkon = (ikon?: React.ReactNode) =>
        ikon ? ikon : <div className={cls.element('ikon-placeholder')} aria-hidden={true} />;

    const setOperator = (operator?: string | ReactNode) =>
        operator ? <Systemtittel className={cls.element('operator')}>{operator}</Systemtittel> : null;

    const setLabelSats = (sats?: number) => (sats ? <Normaltekst>({visSatsMedEttDesimal(sats)}%)</Normaltekst> : null);

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
                <Normaltekst className={cls.element('sum')}>
                    {props.ikkePenger || typeof props.verdi === 'string' ? props.verdi : formatterPenger(props.verdi)}
                </Normaltekst>
            </div>
        </div>
    );
};

export default Utregningsrad;
