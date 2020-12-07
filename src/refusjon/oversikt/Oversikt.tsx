import { EtikettInfo } from 'nav-frontend-etiketter';
import Veilederpanel from 'nav-frontend-veilederpanel';
import React, { FunctionComponent, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as SnakkeBoble } from '../../asset/image/snakkeboble.svg';
import { useInnloggetBruker } from '../../bruker/BrukerContext';
import { useHentRefusjoner } from '../../services/rest-service';
import BEMHelper from '../../utils/bem';
import { formatterDato } from '../../utils/datoUtils';
import { storForbokstav } from '../../utils/stringUtils';
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
            return behandletType.filter((element) => element.tilskuddsgrunnlag.tiltakstype === filter.tiltakstype);
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
                                pathname: `/refusjon/${ref.id}`,
                                search: window.location.search,
                            })
                        }
                    >
                        {settKolonne(
                            `${ref.tilskuddsgrunnlag.deltakerFornavn} ${ref.tilskuddsgrunnlag.deltakerEtternavn}`
                        )}
                        {settKolonne(
                            `${formatterDato(ref.tilskuddsgrunnlag.tilskuddFom)} - ${formatterDato(
                                ref.tilskuddsgrunnlag.tilskuddTom
                            )}`
                        )}
                        {settKolonne('???')}
                        <div className={cls.element('kolonne')}>
                            <EtikettInfo>{storForbokstav(ref.status)}</EtikettInfo>
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
