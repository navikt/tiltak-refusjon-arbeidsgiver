import { BodyShort, Heading } from '@navikt/ds-react';
import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { Inntektslinje, Tilskuddsgrunnlag } from '../refusjon/refusjon';
import { formatterPenger } from '../utils/PengeUtils';
import BEMHelper from '../utils/bem';
import { visSatsMedNorskFormatering } from '../utils/utregningUtil';
import './Utregningsrad.less';

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
    className?: string;
    utgår?: boolean;
}

const cls = BEMHelper('utregning-rad');

const Utregningsrad: FunctionComponent<PropsWithChildren<Props>> = (props) => {
    const setIkon = (ikon?: React.ReactNode) =>
        ikon ? ikon : <span className={cls.element('ikon-placeholder')} aria-hidden={true} />;

    const setOperator = (operator?: string | ReactNode) =>
        operator ? (
            <Heading size="medium" className={cls.element('operator')}>
                {operator}
            </Heading>
        ) : null;

    const setLabelSats = (sats?: number) =>
        sats ? <BodyShort size="small">({visSatsMedNorskFormatering(sats)}%)</BodyShort> : null;

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
        <div className={cls.element('utregning-wrapper', border()) + (props.className ? ' ' + props.className : '')}>
            <div className={cls.element('rad')}>
                <div className={cls.element('utregning-label')}>
                    <div className={cls.element('label-innhold')}>
                        {setIkon(props.labelIkon)}
                        {
                            <span id={labelTekstString}>
                                {props.labelTekst} {props.utgår ? <b>UTGÅR</b> : null}
                            </span>
                        }
                    </div>
                    {props.labelSats && setLabelSats(props.labelSats)}
                </div>
                <span className={cls.element('utregning-verdi')}>
                    {setOperator(props.verdiOperator)}
                    <BodyShort
                        size="small"
                        className={[cls.element('sum'), props.utgår && cls.element('utgår')].filter((x) => x).join(' ')}
                        aria-labelledby={labelTekstString}
                    >
                        {props.ikkePenger || typeof props.verdi === 'string'
                            ? props.verdi
                            : formatterPenger(props.verdi)}
                    </BodyShort>
                </span>
            </div>
            {props.children && (
                <div style={{ marginLeft: '2rem', marginRight: '10rem', marginBottom: '1rem' }}>{props.children}</div>
            )}
        </div>
    );
};

export default Utregningsrad;
