import { EtikettAdvarsel, EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { statusTekst } from '../../messages';
import { RefusjonStatus } from '../../refusjon/status';
import { formatterDato } from '../../utils/datoUtils';
import { storForbokstav } from '../../utils/stringUtils';

interface Props {
    status: RefusjonStatus;
    tilskuddFom: string;
    tilskuddTom: string;
}

const StatusTekst: FunctionComponent<Props> = (props) => {
    if (props.status === RefusjonStatus.KLAR_FOR_INNSENDING) {
        return <EtikettSuksess>Klar for innsending</EtikettSuksess>;
    } else if (props.status === RefusjonStatus.FOR_TIDLIG) {
        return <EtikettInfo>Søk fra {formatterDato(props.tilskuddTom)}</EtikettInfo>;
    } else if (
        props.status === RefusjonStatus.UTGÅTT ||
        props.status === RefusjonStatus.ANNULLERT ||
        props.status === RefusjonStatus.UTBETALING_FEILET
    ) {
        return <EtikettAdvarsel>{storForbokstav(statusTekst[props.status])}</EtikettAdvarsel>;
    } else if (props.status === RefusjonStatus.UTBETALT) {
        return <EtikettSuksess>Utbetalt</EtikettSuksess>;
    }
    return <EtikettInfo>{storForbokstav(statusTekst[props.status])}</EtikettInfo>;
};

export default StatusTekst;
