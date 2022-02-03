import React, { FunctionComponent } from 'react';
import { Input } from 'nav-frontend-skjema';

const Sokefelt: FunctionComponent = () => {
    return (
        <Input
            aria-label="Søk etter bedrift"
            type="search"
            placeholder="orgnr eller navn"
            size={35}
            label="Søk etter bedrift"
        />
    );
};
export default Sokefelt;
