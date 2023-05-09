import React, { FunctionComponent, useContext } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import BEMHelper from '../../../../utils/bem';
import { MenyContext } from '../../BedriftsmenyRefusjon';
import { Alert } from '@navikt/ds-react';

const TomtSok: FunctionComponent<{}> = () => {
    const cls = BEMHelper('bedriftliste');
    const { sokefelt } = useContext(MenyContext);
    const ingenSoketreff = sokefelt.aktivt && sokefelt.antallTreff === 0;

    return (
        <>
            {ingenSoketreff && (
                <div className={cls.element('tomt-sok')}>
                    <Alert variant="info" size="small">
                        <>
                            <Normaltekst>Søket returnerte ingen treff.</Normaltekst>
                        </>
                    </Alert>
                </div>
            )}
        </>
    );
};
export default TomtSok;
