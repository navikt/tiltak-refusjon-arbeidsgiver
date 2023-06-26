import React, { FunctionComponent } from 'react';
import { useInnloggetBruker } from '../../bruker/BrukerContext';
import { useHentRefusjoner } from '../../services/rest-service';
import { antallRefusjoner } from '../../utils/amplitude-utils';
import BEMHelper from '../../utils/bem';
import { useFilter } from './FilterContext';
import FinnerIngenRefusjoner from './FinnerIngenRefusjon/FinnerIngenRefusjoner';
import LabelRad from './LabelRad';
import './oversikt.less';
import { BrukerContextType } from '../../bruker/BrukerContextType';
import useOppdaterPagedata from '../../bruker/bedriftsmenyRefusjon/useOppdaterPagedata';

import OversiktTabell from './OversiktTabell';

const cls = BEMHelper('oversikt');

const Oversikt: FunctionComponent = () => {
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { setValgtBedrift, valgtBedrift } = brukerContext;
    const { filter } = useFilter();
    const pagable = useHentRefusjoner(brukerContext, filter);
    const { refusjoner } = pagable;
    useOppdaterPagedata(pagable, valgtBedrift, setValgtBedrift);
    antallRefusjoner(refusjoner.length > 0 ? refusjoner.length : 0);

    return (
        <nav className={cls.className} aria-label="Main">
            <div role="list">
                <LabelRad />
                {refusjoner.length > 0 ? (
                    <OversiktTabell refusjoner={pagable.refusjoner} />
                ) : (
                    <FinnerIngenRefusjoner orgnr={brukerContext.valgtBedrift.valgtOrg?.[0].OrganizationNumber} />
                )}
            </div>
        </nav>
    );
};

export default Oversikt;
