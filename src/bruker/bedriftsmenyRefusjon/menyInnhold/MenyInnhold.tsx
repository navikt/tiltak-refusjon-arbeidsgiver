import React, { FunctionComponent } from 'react';
import BedriftListe from './bedriftliste/BedriftListe';
import BEMHelper from '../../../utils/bem';
import './menyInnhold.less';
import RadioValg from './RadioValg';
import ValgteBedrifter from './ValgteBedrifter';
import Sokefelt from './Sokefelt';

const MenyInnhold: FunctionComponent = () => {
    const cls = BEMHelper('menyInnhold');

    return (
        <div className={cls.className}>
            <div className={cls.element('liste-sok-innhold')}>
                <Sokefelt />
                <RadioValg className={cls.className} />
            </div>
            <div className={cls.element('liste-innhold')}>
                <ValgteBedrifter />
                <BedriftListe />
            </div>
        </div>
    );
};

export default MenyInnhold;
