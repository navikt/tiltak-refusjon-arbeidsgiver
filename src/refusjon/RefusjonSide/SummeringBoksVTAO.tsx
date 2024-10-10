import Pengesedler from '@/asset/image/pengesedler.svg?react';
import { Label, BodyShort } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjonsgrunnlag } from '../refusjon';
import { RefusjonStatus } from '../status';
import Boks from '../../komponenter/Boks/Boks';

type Props = {
    refusjonsgrunnlag: Refusjonsgrunnlag;
    status: RefusjonStatus;
    erForKorreksjon: boolean;
};

const SummeringBoksVTAO: FunctionComponent<Props> = (props) => {
    return (
        <Boks variant="blå">
            <div style={{ margin: '0.5rem 1rem 0 0' }}>
                <Pengesedler />
            </div>
            <div>
                <Label>Dere får utbetalt</Label>
                <VerticalSpacer rem={0.5} />
                <BodyShort size="small">
                    <b>{formatterPenger(props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddsbeløp || 0)}</b> for perioden{' '}
                    {formatterPeriode(
                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                    )}{' '}
                    til kontonummer {props.refusjonsgrunnlag.bedriftKontonummer}
                </BodyShort>
                <VerticalSpacer rem={1} />
                <BodyShort size="small">
                    Tilskudd for varig tilrettelagt arbeid i ordinær virksomhet blir automatisk utbetalt på konto
                    etterskuddsvis, hver måned. Det tar 2-3 dager før pengene står på konto.
                </BodyShort>
            </div>
        </Boks>
    );
};

export default SummeringBoksVTAO;