import moment from 'moment';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { FunctionComponent } from 'react';
import BEMHelper from '../../../utils/bem';
import { formatterDato, NORSK_DATO_OG_TID_FORMAT } from '../../../utils/datoUtils';
import { Refusjon } from '../../refusjon';

interface Properties {
    refusjon: Refusjon;
}

const InntektsMeldingHeader: FunctionComponent<Properties> = ({ refusjon }: Properties) => {
    const cls = BEMHelper('inntektsmelding');
    const månedNavn = moment(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom).format('MMMM');

    return (
        <div className={cls.element('header')}>
            <Undertittel className={cls.element('header-tittel')}>
                Inntekter hentet fra a-meldingen for {månedNavn} måned{' '}
                {refusjon.unntakOmInntekterToMånederFrem && 'og 2 måneder etter'}
            </Undertittel>
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
