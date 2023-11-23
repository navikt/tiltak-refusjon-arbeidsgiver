import { ReactComponent as Pengesedler } from '@/asset/image/pengesedler.svg';
import { Label } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjonsgrunnlag } from '../refusjon';
import Boks from '../../komponenter/Boks/Boks';

type Props = {
    refusjonsgrunnlag: Refusjonsgrunnlag;
};

const SummeringBoksNullbeløp: FunctionComponent<Props> = (props) => {
    return (
        <Boks variant="blå">
            <div style={{ paddingRight: '1.5rem' }}>
                <Pengesedler />
            </div>
            <Label>
                Refusjonen er godtatt med {formatterPenger(0)} for perioden{' '}
                {formatterPeriode(
                    props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom,
                    props.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddTom
                )}
            </Label>
        </Boks>
    );
};

export default SummeringBoksNullbeløp;
