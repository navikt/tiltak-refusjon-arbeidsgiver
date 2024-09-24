import { BodyLong, Heading, Tag } from '@navikt/ds-react';
import { FunctionComponent, ReactElement } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { statusTekst } from '../../messages';
import { RefusjonStatus } from '../status';
import { NORSK_DATO_FORMAT, NORSK_DATO_OG_TID_FORMAT, formatterDato } from '../../utils/datoUtils';
import { storForbokstav } from '../../utils/stringUtils';
import { Refusjon } from '../refusjon';
import Boks from '../../komponenter/Boks/Boks';
import TilskuddssatsVTAO from '../RefusjonSide/TilskuddssatsVTAO';
import SummeringBoksVTAO from '../RefusjonSide/SummeringBoksVTAO';
import InformasjonFraAvtalenVTAO from '../RefusjonSide/informasjonAvtalen/InformasjonFraAvtalenVTAO';
import moment from 'moment';

export const etikettForRefusjonStatus = (refusjon: Refusjon): ReactElement => {
    if (refusjon.status === RefusjonStatus.UTBETALING_FEILET) {
        return (
            <Tag variant="error" style={{ float: 'right' }}>
                {storForbokstav(statusTekst[refusjon.status])}{' '}
            </Tag>
        );
    } else if (refusjon.status === RefusjonStatus.UTBETALT) {
        return (
            <Tag variant="success" style={{ float: 'right' }}>
                {storForbokstav(statusTekst[RefusjonStatus.SENDT_KRAV])}{' '}
                {refusjon.godkjentAvArbeidsgiver && formatterDato(refusjon.godkjentAvArbeidsgiver, NORSK_DATO_FORMAT)}
                {', '}
                {storForbokstav(statusTekst[refusjon.status])}{' '}
                {refusjon.utbetaltTidspunkt && formatterDato(refusjon.utbetaltTidspunkt, NORSK_DATO_FORMAT)}
            </Tag>
        );
    } else if (refusjon.status === RefusjonStatus.FOR_TIDLIG) {
        return (
            <Tag variant="info" style={{ float: 'right' }}>
                Sendes{' '}
                {formatterDato(
                    moment(refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom).add(1, 'days').toString(),
                    NORSK_DATO_FORMAT
                )}
            </Tag>
        );
    } else {
        return (
            <Tag variant="info" style={{ float: 'right' }}>
                {storForbokstav(statusTekst[refusjon.status])}{' '}
                {refusjon.godkjentAvArbeidsgiver && formatterDato(refusjon.godkjentAvArbeidsgiver, NORSK_DATO_FORMAT)}
            </Tag>
        );
    }
};

type Props = {
    refusjon: Refusjon;
};

const KvitteringSideVTAO: FunctionComponent<Props> = ({ refusjon }) => {
    return (
        <Boks variant="hvit">
            {etikettForRefusjonStatus(refusjon)}
            <VerticalSpacer rem={3} />
            <Heading level="2" size="large">
                Refusjon av varig tilrettelagt arbeid i ordinær virksomhet
            </Heading>
            <VerticalSpacer rem={1} />
            <BodyLong>
                Arbeidsgiveren får et tilskudd fra NAV for varig tilrettelagt arbeid. Tilskuddssatsen er 6 808 kroner
                per måned. Satsen settes årlig av departementet og avtale- og refusjonsløsningen vil automatisk
                oppdateres når det kommer nye satser.
            </BodyLong>
            <VerticalSpacer rem={1} />
            <InformasjonFraAvtalenVTAO refusjon={refusjon} />
            <VerticalSpacer rem={2} />
            <TilskuddssatsVTAO />
            <VerticalSpacer rem={1} />
            <SummeringBoksVTAO
                erForKorreksjon={false}
                refusjonsgrunnlag={refusjon.refusjonsgrunnlag}
                status={refusjon.status}
            />
        </Boks>
    );
};

export default KvitteringSideVTAO;
