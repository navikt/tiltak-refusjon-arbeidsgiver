import Pengesedler from '@/asset/image/pengesedler.svg?react';
import { Label } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjonsgrunnlag } from '../refusjon';
import Boks from '../../komponenter/Boks/Boks';
import VerticalSpacer from '@/komponenter/VerticalSpacer';

type Props = {
    refusjonsgrunnlag: Refusjonsgrunnlag;
};

const SummeringBoksNullbeløp: FunctionComponent<Props> = (props) => {
    return (
        <Boks variant="blå">
            <div style={{ margin: 'auto 1.5rem auto 0' }}>
                <Pengesedler />
            </div>
            <div>
                <VerticalSpacer rem={0.5} />
                <Label>
                    Refusjonen er godtatt med {formatterPenger(0)} for perioden{' '}
                    {formatterPeriode(
                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                        props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                    )}
                </Label>
            </div>
        </Boks>
    );
};

export default SummeringBoksNullbeløp;
