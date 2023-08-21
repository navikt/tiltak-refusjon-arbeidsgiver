import { LinkPanel, BodyShort } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusTekst from '../../komponenter/StatusTekst/StatusTekst';
import BEMHelper from '../../utils/bem';
import { formatterDato, formatterPeriode, NORSK_DATO_FORMAT_SHORT } from '../../utils/datoUtils';
import { Refusjon } from '../refusjon';
import './OversiktTabell.less';

type Props = {
    refusjoner: Refusjon[];
};
const cls = BEMHelper('oversiktTabell');

const OversiktTabell: FunctionComponent<Props> = (props) => {
    const navigate = useNavigate();
    return (
        <>
            {props.refusjoner.map((refusjon) => (
                <LinkPanel
                    className={cls.element('linkPanel')}
                    border={false}
                    role="listitem"
                    key={refusjon.id}
                    onClick={(event) => {
                        event.preventDefault();
                        navigate({
                            pathname: `/refusjon/${refusjon.id}`,
                            search: window.location.search,
                        });
                    }}
                    href={`/refusjon/${refusjon.id}`}
                >
                    <LinkPanel.Title className={cls.element('linkpanel_title_row')}>
                        <BodyShort
                            size="small"
                            className={cls.element('title_row_column')}
                            aria-labelledby={cls.element('deltaker')}
                        >
                            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.deltakerFornavn}{' '}
                            {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.deltakerEtternavn}
                        </BodyShort>
                        <BodyShort
                            size="small"
                            className={cls.element('title_row_column')}
                            aria-labelledby={cls.element('periode')}
                        >
                            {formatterPeriode(
                                refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                                refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom,
                                NORSK_DATO_FORMAT_SHORT
                            )}
                        </BodyShort>
                        <div className={cls.element('title_row_column')}>
                            <StatusTekst
                                status={refusjon.status}
                                tilskuddFom={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom}
                                tilskuddTom={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom}
                            />
                        </div>
                        <BodyShort
                            size="small"
                            className={cls.element('title_row_column')}
                            aria-labelledby={cls.element('frist-godkjenning')}
                        >
                            {formatterDato(refusjon.fristForGodkjenning)}
                        </BodyShort>
                    </LinkPanel.Title>
                </LinkPanel>
            ))}
        </>
    );
};

export default OversiktTabell;
