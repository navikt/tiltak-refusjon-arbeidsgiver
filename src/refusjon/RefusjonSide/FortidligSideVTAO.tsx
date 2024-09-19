import React, { FunctionComponent, ReactNode } from 'react';
import { useParams } from 'react-router';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { tiltakstypeTekst } from '../../messages';
import { useHentRefusjon } from '../../services/rest-service';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Alert, Label, BodyShort, Heading, BodyLong } from '@navikt/ds-react';
import Boks from '../../komponenter/Boks/Boks';
import InformasjonFraAvtalen from './informasjonAvtalen/InformasjonFraAvtalen';
import InformasjonFraAvtalenVTAO from './informasjonAvtalen/InformasjonFraAvtalenVTAO';
import TilskuddssatsVTAO from './TilskuddssatsVTAO';
import SummeringBoks from './SummeringBoks';
import SummeringBoksVTAO from './SummeringBoksVTAO';

type AlertStripeType = 'info' | 'success' | 'warning' | 'error';

type Props = {
    feiltekst: ReactNode;
    advarselType: AlertStripeType;
};

const FortidligSideVTAO: FunctionComponent<Props> = (props) => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);

    return (
        <Boks variant="hvit">
            <Alert variant={props.advarselType}>{props.feiltekst}</Alert>
            <VerticalSpacer rem={2} />
            <Heading level="2" size="large">
                Refusjon av Varig tilrettelagt arbeid i ordinær virksomhet (VTA-O)
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

export default FortidligSideVTAO;
