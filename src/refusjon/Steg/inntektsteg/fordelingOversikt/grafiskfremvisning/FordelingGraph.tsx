import React, { FunctionComponent, useState } from 'react';
import BEMHelper from '../../../../../utils/bem';
import debounce from 'lodash.debounce';
import './fordelingGraph.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { Enhet, Inntekt, PositionInfo } from './fordelingTypes';

interface Props {
    svgWidth: number;
    svgHeight: number;
    gridEnhetMnd: number;
    maander: React.ReactNode;
    tilskuddPeriode: React.ReactNode;
    inntekt: Inntekt[];
    inntektNode: React.ReactNode;
    gridMap: Enhet[];
}

const cls = BEMHelper('fordelinggraph');

const FordelingGraph: FunctionComponent<Props> = (props) => {
    const [position, setPosition] = useState<PositionInfo | undefined>(undefined);

    const mousePointerEvent = (event: any) => {
        let inntektInfo: undefined | React.ReactNode = <Normaltekst>ingen inntekt</Normaltekst>;
        let inntektFelt: undefined | { id: string }[] = undefined;

        const inntekter = props.gridMap.find(
            (enhet) =>
                enhet.koordinatStart <= event.nativeEvent.layerX && enhet.koordinatSlutt >= event.nativeEvent.layerX
        );

        if (inntekter && inntekter.inntekt) {
            inntektFelt = inntekter.inntekt.map((i) => {
                return { id: i.id };
            });

            inntektInfo = inntekter.inntekt.map((i, dex) => {
                return (
                    <ul className={cls.element('label-list')} key={dex}>
                        <li>
                            <Normaltekst>
                                {moment(i.fraDato).format('MM.DD')}-{moment(i.tilDato).format('DD-MM')}
                            </Normaltekst>
                        </li>
                        <li>
                            <Normaltekst>{i.belop}kr</Normaltekst>
                        </li>
                    </ul>
                );
            });
        }

        setPosition({
            yPos: event.nativeEvent.layerY,
            xPos: event.nativeEvent.layerX,
            dato: inntekter?.dato,
            inntektLabel: inntektInfo,
            inntektFeltId: inntektFelt,
        });
    };

    const debounceMousePointerEvent = debounce(mousePointerEvent, 5);

    return (
        <>
            <figure className={cls.className}>
                <label
                    style={{ left: `${(position && (position.xPos - 110).toString().concat('px')) || '0'}` }}
                    className={cls.element('infolabel')}
                >
                    <Element className={cls.element('boldFont')}>Dato</Element>
                    <Normaltekst className={cls.element('boldFont')}>{(position && position.dato) || ''}</Normaltekst>
                    {position && position.inntektLabel}
                </label>
                <figcaption>
                    <svg
                        width={props.svgWidth.toString()}
                        height={props.svgHeight.toString()}
                        viewBox={`0 0 ${props.svgWidth} ${props.svgHeight}`}
                        onMouseMove={debounceMousePointerEvent}
                    >
                        <g className={cls.element('grid')}>
                            <g className={cls.element('labels x-labels')}>{props.maander}</g>
                            {props.inntektNode}
                            {props.tilskuddPeriode}
                            <g className="grid v-grid" id="vGrid">
                                <line
                                    className={cls.element('dataInfo')}
                                    y1="64"
                                    y2={props.svgHeight - 15}
                                    x1={(position && position.xPos) || '0'}
                                    x2={(position && position.xPos) || '0'}
                                />

                                <polygon
                                    className={cls.element('dataInfo', 'triangle')}
                                    points="12,12 0,12 6,24"
                                    transform={`translate(${(position && position.xPos - 6) || 0}, 40)`}
                                    x={(position && position.xPos) || '0'}
                                    y="50"
                                    stroke="0"
                                />
                                {position?.inntektFeltId?.map((felt, index) => {
                                    return (
                                        <g key={index}>
                                            <circle
                                                className={cls.element('dataInfo')}
                                                cx={(position && position.xPos) || '0'}
                                                cy={128 + parseInt(felt.id) * 64}
                                                r="2"
                                                strokeWidth="1"
                                                opacity="0.6"
                                                fill="black"
                                            />
                                            <circle
                                                className={cls.element('dataInfo')}
                                                cx={(position && position.xPos) || '0'}
                                                cy={128 + parseInt(felt.id) * 64}
                                                r="5"
                                                strokeWidth="0"
                                                opacity="0.6"
                                                fill="#B7CFC0"
                                            />
                                        </g>
                                    );
                                })}
                            </g>
                        </g>
                    </svg>
                </figcaption>
            </figure>
        </>
    );
};

export default FordelingGraph;
