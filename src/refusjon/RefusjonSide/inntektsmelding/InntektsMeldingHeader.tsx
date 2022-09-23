import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { FunctionComponent } from 'react';
import BEMHelper from '../../../utils/bem';
import { formatterDato, månedsNavn, NORSK_DATO_OG_TID_FORMAT } from '../../../utils/datoUtils';
import { Refusjon } from '../../refusjon';

interface Properties {
    refusjon: Refusjon;
}

const InntektsMeldingHeader: FunctionComponent<Properties> = ({ refusjon }: Properties) => {
    const cls = BEMHelper('inntektsmelding');
    const månedNavn = månedsNavn(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);

    return (
        <div className={cls.element('header')}>
            <Undertittel className={cls.element('header-tittel')}>
                Inntekter hentet fra a-meldingen for {månedNavn} måned{' '}
                {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype === 'SOMMERJOBB' ? (
                    <>{refusjon.unntakOmInntekterToMånederFrem ? 'og 2 måneder etter' : 'og 1 måned etter'}</>
                ) : (
                    <>{refusjon.unntakOmInntekterToMånederFrem && 'og 2 måneder etter'}</>
                )}
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
