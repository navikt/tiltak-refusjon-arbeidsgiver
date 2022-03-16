import React, { FunctionComponent, useContext } from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import BEMHelper from '../../../../utils/bem';
import { MenyContext } from '../../BedriftsmenyRefusjon';

const TomtSok: FunctionComponent<{}> = () => {
    const cls = BEMHelper('bedriftliste');
    const { sokefelt } = useContext(MenyContext);
    const ingenSoketreff = sokefelt.aktivt && sokefelt.antallTreff === 0;

    return (
        <>
            {ingenSoketreff && (
                <div className={cls.element('tomt-sok')}>
                    <AlertStripeInfo>
                        <>
                            <Normaltekst>Søket returnerte ingen treff.</Normaltekst>
                        </>
                    </AlertStripeInfo>
                </div>
            )}
        </>
    );
};
export default TomtSok;
