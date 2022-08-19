import React, { FunctionComponent } from 'react';
import BedriftListe from './bedriftliste/BedriftListe';
import BEMHelper from '../../../utils/bem';
import './menyInnhold.less';
import RadioValg from './RadioValg';
import Sokefelt from './Sokefelt';
import { ClsBedriftsmeny } from '../api/api';

const MenyInnhold: FunctionComponent = () => {
    const cls = BEMHelper(ClsBedriftsmeny.MENYINNHOLD);

    return (
        <div className={cls.className}>
            <div className={cls.element('liste-sok-innhold')}>
                <Sokefelt />
                <RadioValg className={cls.className} />
            </div>
            <div className={cls.element('liste-innhold')}>
                <BedriftListe />
            </div>
        </div>
    );
};

export default MenyInnhold;
