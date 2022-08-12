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
import { BrukerContextType } from '../../bruker/BrukerContextType';
import useOppdaterPagedata from '../../bruker/bedriftsmenyRefusjon/useOppdaterPagedata';

const cls = BEMHelper('oversikt');

const Kolonne: FunctionComponent = (props) => <div className={cls.element('kolonne')}>{props.children}</div>;

const Oversikt: FunctionComponent = () => {
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { setValgtBedrift, valgtBedrift } = brukerContext;
    const { filter } = useFilter();
    const pagable = useHentRefusjoner(brukerContext, filter);
    const { refusjoner } = pagable;
    useOppdaterPagedata(pagable, valgtBedrift, setValgtBedrift);

    const navigate = useNavigate();
    antallRefusjoner(refusjoner.length > 0 ? refusjoner.length : 0);

    return (
        <nav className={cls.className} aria-label="Main">
            <div role="list">
                <LabelRad className={cls.className} />
                {refusjoner.length > 0 ? (
                    refusjoner.map((refusjon) => {
                        const { deltakerEtternavn, deltakerFornavn, tilskuddTom, tilskuddFom } =
                            refusjon.refusjonsgrunnlag.tilskuddsgrunnlag;
                        return (
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
                                    {deltakerFornavn} {deltakerEtternavn}
                                </Kolonne>
                                <Kolonne aria-labelledby={cls.element('periode')}>
                                    {formatterPeriode(tilskuddFom, tilskuddTom)}
                                </Kolonne>
                                <Kolonne aria-labelledby={cls.element('status')}>
                                    <StatusTekst
                                        status={refusjon.status}
                                        tilskuddFom={tilskuddFom}
                                        tilskuddTom={tilskuddTom}
                                    />
                                </Kolonne>
                                <Kolonne aria-labelledby={cls.element('frist-godkjenning')}>
                                    {formatterDato(refusjon.fristForGodkjenning)}
                                </Kolonne>
                            </LenkepanelBase>
                        );
                    })
                ) : (
                    <FinnerIngenRefusjoner orgnr={brukerContext.valgtBedrift.valgtOrg?.[0].OrganizationNumber} />
                )}
            </div>
        </nav>
    );
};

export default Oversikt;
