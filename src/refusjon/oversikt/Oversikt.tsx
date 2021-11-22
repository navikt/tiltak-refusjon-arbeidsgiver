import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router';
import { useInnloggetBruker } from '../../bruker/BrukerContext';
import StatusTekst from '../../komponenter/StatusTekst/StatusTekst';
import { useHentRefusjoner } from '../../services/rest-service';
import { antallRefusjoner } from '../../utils/amplitude-utils';
import BEMHelper from '../../utils/bem';
import { formatterDato, formatterPeriode } from '../../utils/datoUtils';
import { useFilter } from './FilterContext';
import FinnerIngenRefusjoner from './FinnerIngenRefusjon/FinnerIngenRefusjoner';
import LabelRad from './LabelRad';
import './oversikt.less';

const cls = BEMHelper('oversikt');

const Kolonne: FunctionComponent = (props) => <div className={cls.element('kolonne')}>{props.children}</div>;

const Oversikt: FunctionComponent = () => {
    const brukerContext = useInnloggetBruker();
    const { filter } = useFilter();
    const refusjoner = useHentRefusjoner(brukerContext.valgtBedrift, filter.status, filter.tiltakstype);
    const navigate = useNavigate();
    antallRefusjoner(refusjoner.length > 0 ? refusjoner.length : 0);

    return (
        <nav className={cls.className} aria-label="Main">
            <div role="list">
                <LabelRad className={cls.className} />
                {refusjoner.length > 0 ? (
                    refusjoner.map((refusjon) => (
                        <LenkepanelBase
                            className={cls.element('rad')}
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
                            <Kolonne aria-labelledby={cls.element('deltaker')}>
                                {refusjon.tilskuddsgrunnlag.deltakerFornavn}{' '}
                                {refusjon.tilskuddsgrunnlag.deltakerEtternavn}
                            </Kolonne>
                            <Kolonne aria-labelledby={cls.element('periode')}>
                                {formatterPeriode(
                                    refusjon.tilskuddsgrunnlag.tilskuddFom,
                                    refusjon.tilskuddsgrunnlag.tilskuddTom
                                )}
                            </Kolonne>
                            <Kolonne aria-labelledby={cls.element('status')}>
                                <StatusTekst
                                    status={refusjon.status}
                                    tilskuddFom={refusjon.tilskuddsgrunnlag.tilskuddFom}
                                    tilskuddTom={refusjon.tilskuddsgrunnlag.tilskuddTom}
                                />
                            </Kolonne>
                            <Kolonne aria-labelledby={cls.element('frist-godkjenning')}>
                                {formatterDato(refusjon.fristForGodkjenning)}
                            </Kolonne>
                        </LenkepanelBase>
                    ))
                ) : (
                    <FinnerIngenRefusjoner orgnr={brukerContext.valgtBedrift} />
                )}
            </div>
        </nav>
    );
};

export default Oversikt;
