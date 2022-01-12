import React, { FunctionComponent } from 'react';
import BedriftListe from './BedriftListe';
import BEMHelper from '../../../utils/bem';
import './menyInnhold.less';
import { Input, Textarea } from 'nav-frontend-skjema';
import RadioValg from './RadioValg';

const MenyInnhold: FunctionComponent = () => {
    const cls = BEMHelper('menyInnhold');

    return (
        <div className={cls.className}>
            <div className={cls.element('liste-sok-innhold')}>
                <Input
                    aria-label="Søk etter bedrift"
                    type="search"
                    placeholder="orgnr eller navn"
                    size={35}
                    label="Søk etter bedrift"
                />
                <RadioValg className={cls.className} />
            </div>
            <div className={cls.element('liste-innhold')}>
                <div>--</div>
                <BedriftListe />
            </div>
        </div>
    );
};

export default MenyInnhold;
