import React, { FunctionComponent } from 'react';
import { Input } from 'nav-frontend-skjema';
import BEMHelper from '../../../utils/bem';
import { ClsBedriftsmeny } from '../api/organisasjon';

const Sokefelt: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.MENYINNHOLD);
    return (
        <Input
            className={cls.element('sokefelt')}
            aria-label="Søk etter bedrift"
            type="search"
            placeholder="orgnr eller navn"
            size={35}
            label="Søk etter bedrift"
        />
    );
};
export default Sokefelt;
