import React, { FunctionComponent } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Refusjon } from '../../refusjon';
import { formatterDato, NORSK_DATO_OG_TID_FORMAT } from '../../../utils/datoUtils';
import BEMHelper from '../../../utils/bem';

interface Properties {
    refusjon: Refusjon;
}

const InntektsMeldingHeader: FunctionComponent<Properties> = ({ refusjon }: Properties) => {
    const cls = BEMHelper('inntektsmelding');
    return (
        <div className={cls.element('header')}>
            <Undertittel className={cls.element('header-tittel')}>Inntekter hentet fra a-meldingen</Undertittel>
            {refusjon.refusjonsgrunnlag.inntektsgrunnlag && (
                <Normaltekst>
                    Sist hentet:{' '}
                    {formatterDato(
                        refusjon.refusjonsgrunnlag.inntektsgrunnlag.innhentetTidspunkt,
                        NORSK_DATO_OG_TID_FORMAT
                    )}
                </Normaltekst>
            )}
        </div>
    );
};
export default InntektsMeldingHeader;
