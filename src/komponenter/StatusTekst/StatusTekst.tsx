import * as React from 'react';
import { FunctionComponent } from 'react';
import { statusTekst } from '../../messages';
import { RefusjonStatus } from '../../refusjon/status';
import { formatterDato } from '../../utils/datoUtils';
import { storForbokstav } from '../../utils/stringUtils';
import { Tag } from '@navikt/ds-react';

interface Props {
    status: RefusjonStatus;
    tilskuddFom: string;
    tilskuddTom: string;
    fratrekkRefunderbarBeløp?: boolean;
}

const StatusTekst: FunctionComponent<Props> = (props) => {
    if (props.status === RefusjonStatus.KLAR_FOR_INNSENDING) {
        if (props.fratrekkRefunderbarBeløp === true) {
            return <Tag variant="warning">Fravær i perioden</Tag>;
        } else {
            return <Tag variant="success">Klar for innsending</Tag>;
        }
    } else if (props.status === RefusjonStatus.FOR_TIDLIG) {
        return <Tag variant="info">Søk fra {formatterDato(props.tilskuddTom)}</Tag>;
    } else if (
        props.status === RefusjonStatus.UTGÅTT ||
        props.status === RefusjonStatus.ANNULLERT ||
        props.status === RefusjonStatus.UTBETALING_FEILET
    ) {
        return <Tag variant="warning">{storForbokstav(statusTekst[props.status])}</Tag>;
    } else if (props.status === RefusjonStatus.UTBETALT) {
        return <Tag variant="success">Utbetalt</Tag>;
    }
    return <Tag variant="info">{storForbokstav(statusTekst[props.status])}</Tag>;
};

export default StatusTekst;
