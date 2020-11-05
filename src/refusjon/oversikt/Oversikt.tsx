import moment from 'moment';
import Veilederpanel from 'nav-frontend-veilederpanel';
import React, { FunctionComponent, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as SnakkeBoble } from '../../asset/image/snakkeboble.svg';
import { ReactComponent as Status } from '../../asset/image/statusplayIkon.svg';
import { useInnloggetBruker } from '../../bruker/BrukerContext';
import { useHentRefusjoner } from '../../services/rest-service';
import BEMHelper from '../../utils/bem';
import { useFilter } from './FilterContext';
import LabelRad from './LabelRad';
import './oversikt.less';

const cls = BEMHelper('oversikt');

const Oversikt: FunctionComponent = () => {
    const brukerContext = useInnloggetBruker();
    const { filter } = useFilter();

    const refusjoner = useHentRefusjoner(brukerContext.valgtBedrift);

    const filtereListe = () => {
        const behandletType = refusjoner ? refusjoner.filter((element) => element.status === filter.status) : [];
        if (filter.tiltakstype) {
            return behandletType.filter((element) => element.tiltakstype === filter.tiltakstype);
        }
        return behandletType;
    };

    const settKolonne = (input: string | number): ReactNode => <div className={cls.element('kolonne')}>{input}</div>;
    const filtrerteRefusjoner = filtereListe();

    const history = useHistory();

    return (
        <div className={cls.className}>
            <LabelRad className={cls.className} />
            {filtrerteRefusjoner && filtrerteRefusjoner.length > 0 ? (
                filtrerteRefusjoner.map((ref) => (
                    <div
                        className={cls.element('rad')}
                        key={ref.id}
                        onClick={() =>
                            history.push({
                                pathname: `/refusjon/${ref.id}/tiltaket`,
                                search: window.location.search,
                            })
                        }
                    >
                        {settKolonne(ref.bedrift)}
                        {settKolonne(ref.deltaker)}
                        {settKolonne(ref.veileder)}
                        {settKolonne(moment(ref.opprettet_tidspunkt).format('DD.MM.YYYY, kk:mm'))}
                        <div className={cls.element('kolonne')}>
                            <span className={cls.element('ikon')}>
                                <Status />
                            </span>
                            <span>Status</span>
                        </div>
                    </div>
                ))
            ) : (
                <Veilederpanel kompakt={true} svg={<SnakkeBoble />}>
                    Det er ikke Registert noen refusjoner pa org. nr: {brukerContext.valgtBedrift}.
                </Veilederpanel>
            )}
        </div>
    );
};

export default Oversikt;
