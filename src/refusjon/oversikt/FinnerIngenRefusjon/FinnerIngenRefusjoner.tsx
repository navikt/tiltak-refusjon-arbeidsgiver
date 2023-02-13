import React, { FunctionComponent } from 'react';
import BEMHelper from '../../../utils/bem';
import { Undertittel } from 'nav-frontend-typografi';
import { ReactComponent as InfoIkon } from '@/asset/image/info.svg';
import './finnerIngenRefusjoner.less';

interface Props {
    orgnr: string;
}

const FinnerIngenRefusjoner: FunctionComponent<Props> = (props) => {
    const { orgnr } = props;
    const cls = BEMHelper('finnerIngenRefusjoner');

    return (
        <div className={cls.className}>
            <Undertittel role="heading" aria-level={2} className={cls.element('tittel')}>
                <InfoIkon className={cls.element('ikon')} width={48} />
                Finner ingen refusjoner på organisasjonsnummer: {orgnr}
            </Undertittel>
        </div>
    );
};

export default FinnerIngenRefusjoner;
