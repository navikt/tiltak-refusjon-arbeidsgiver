import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';

interface LagNyRadProps {
    navn: string;
    verdi: string;
    navnIcon?: React.ReactNode;
    verdiIcon?: React.ReactNode;
}

const LagNyRad: FunctionComponent<LagNyRadProps> = ({ navn, verdi, navnIcon, verdiIcon }: LagNyRadProps) => (
    <div className="refusjonFeilet__rad">
        <div>
            <span>{navnIcon}</span>
            <Element>{navn}</Element>
        </div>
        <div>
            <span className="refusjonFeilet__verdi-icon">{verdiIcon}</span>
            <Normaltekst>{verdi}</Normaltekst>
        </div>
    </div>
);
export default LagNyRad;
