import { ReactComponent as Pengesedler } from '@/asset/image/pengesedler.svg';
import { Label } from '@navikt/ds-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { formatterPeriode } from '../../utils/datoUtils';
import { formatterPenger } from '../../utils/PengeUtils';
import { Refusjonsgrunnlag } from '../refusjon';

const Boks = styled.div`
    display: flex;
    flex-direction: row;
    border: 3px solid #cce1f3;
    border-radius: 4px;
    padding: 1.75rem;
    margin-bottom: 1rem;
`;

type Props = {
    refusjonsgrunnlag: Refusjonsgrunnlag;
};


const SummeringBoksNullbeløp: FunctionComponent<Props> = (props) => {

    return (
        <Boks>
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
