import React, { FunctionComponent } from 'react';
import { Label, BodyShort } from '@navikt/ds-react';

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
            <Label>{navn}</Label>
        </div>
        <div>
            <span className="refusjonFeilet__verdi-icon">{verdiIcon}</span>
            <BodyShort size="small">{verdi}</BodyShort>
        </div>
    </div>
);
export default LagNyRad;
