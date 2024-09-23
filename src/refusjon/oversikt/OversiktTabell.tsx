import { LinkPanel, BodyShort, Table, Label } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusTekst from '../../komponenter/StatusTekst/StatusTekst';
import BEMHelper from '../../utils/bem';
import { formatterDato, formatterPeriode, NORSK_DATO_FORMAT_SHORT } from '../../utils/datoUtils';
import { Refusjon, SortingOrder } from '../refusjon';
import './OversiktTabell.less';
import { storForbokstav } from '@/utils/stringUtils';
import { tiltakstypeTekst } from '@/messages';
import SortingValg from './SortingValg';
import { useFilter } from './FilterContext';

type Props = {
    refusjoner: Refusjon[];
};
const cls = BEMHelper('oversiktTabell');

const OversiktTabell: FunctionComponent<Props> = (props) => {
    const navigate = useNavigate();
    const { filter } = useFilter();
    return (
        <Table style={{ backgroundColor: 'white' }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">
                        <Label className={cls.element('label')}>Tiltakstype</Label>
                        <SortingValg
                            className={cls.className}
                            sortingAsc={SortingOrder.TILTAKSTYPE_ASC}
                            sortingDesc={SortingOrder.TILTAKSTYPE_DESC}
                            highlightSortOrderAsc={filter.sorting === SortingOrder.TILTAKSTYPE_ASC}
                            highlightSortOrderDesc={filter.sorting === SortingOrder.TILTAKSTYPE_DESC}
                        />
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        <Label className={cls.element('label')}>Bedrift</Label>
                        <SortingValg
                            className={cls.className}
                            sortingAsc={SortingOrder.BEDRIFT_ASC}
                            sortingDesc={SortingOrder.BEDRIFT_DESC}
                            highlightSortOrderAsc={filter.sorting === SortingOrder.BEDRIFT_ASC}
                            highlightSortOrderDesc={filter.sorting === SortingOrder.BEDRIFT_DESC}
                        />
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        <Label className={cls.element('label')}>Deltaker</Label>
                        <SortingValg
                            className={cls.className}
                            sortingAsc={SortingOrder.DELTAKER_ASC}
                            sortingDesc={SortingOrder.DELTAKER_DESC}
                            highlightSortOrderAsc={filter.sorting === SortingOrder.DELTAKER_ASC}
                            highlightSortOrderDesc={filter.sorting === SortingOrder.DELTAKER_DESC}
                        />
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        <Label className={cls.element('label')}>Periode</Label>
                        <SortingValg
                            className={cls.className}
                            sortingAsc={SortingOrder.PERIODE_ASC}
                            sortingDesc={SortingOrder.PERIODE_DESC}
                            highlightSortOrderAsc={filter.sorting === SortingOrder.PERIODE_ASC}
                            highlightSortOrderDesc={filter.sorting === SortingOrder.PERIODE_DESC}
                        />
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        <Label className={cls.element('label')}>Status</Label>
                        <SortingValg
                            className={cls.className}
                            sortingAsc={SortingOrder.STATUS_ASC}
                            sortingDesc={SortingOrder.STATUS_DESC}
                            highlightSortOrderAsc={
                                filter.sorting === SortingOrder.STATUS_ASC || filter.sorting === undefined
                            }
                            highlightSortOrderDesc={filter.sorting === SortingOrder.STATUS_DESC}
                        />
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        <Label className={cls.element('label')}>Frist for godkjenning</Label>
                        <SortingValg
                            className={cls.className}
                            sortingAsc={SortingOrder.FRISTFORGODKJENNING_ASC}
                            sortingDesc={SortingOrder.FRISTFORGODKJENNING_DESC}
                            highlightSortOrderAsc={filter.sorting === SortingOrder.FRISTFORGODKJENNING_ASC}
                            highlightSortOrderDesc={filter.sorting === SortingOrder.FRISTFORGODKJENNING_DESC}
                        />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.refusjoner.map((refusjon) => (
                    <Table.Row
                        key={refusjon.id}
                        onClick={(event) => {
                            event.preventDefault();
                            navigate({
                                pathname: `/refusjon/${refusjon.id}`,
                                search: window.location.search,
                            });
                        }}
                    >
                        <Table.DataCell>
                            <BodyShort
                                size="small"
                                className={cls.element('title_row_column')}
                                aria-labelledby={cls.element('deltaker')}
                            >
                                {storForbokstav(
                                    tiltakstypeTekst[refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype]
                                )}
                            </BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort
                                size="small"
                                className={cls.element('title_row_column')}
                                aria-labelledby={cls.element('deltaker')}
                            >
                                {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.bedriftNavn}{' '}
                            </BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort
                                size="small"
                                className={cls.element('title_row_column')}
                                aria-labelledby={cls.element('deltaker')}
                            >
                                {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.deltakerFornavn}{' '}
                                {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.deltakerEtternavn}
                            </BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
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
                        </Table.DataCell>
                        <Table.DataCell>
                            <div className={cls.element('title_row_column')}>
                                <StatusTekst
                                    status={refusjon.status}
                                    tiltakstype={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype}
                                    tilskuddFom={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom}
                                    tilskuddTom={refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom}
                                    fratrekkRefunderbarBeløp={refusjon.refusjonsgrunnlag.fratrekkRefunderbarBeløp}
                                />
                            </div>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort
                                size="small"
                                className={cls.element('title_row_column')}
                                aria-labelledby={cls.element('frist-godkjenning')}
                            >
                                {refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tiltakstype !== 'VTAO'
                                    ? formatterDato(refusjon.fristForGodkjenning)
                                    : ''}
                            </BodyShort>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
    {
        /*
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
                </LinkPanel>
            ))}
        </>
        */
    }
};

export default OversiktTabell;
