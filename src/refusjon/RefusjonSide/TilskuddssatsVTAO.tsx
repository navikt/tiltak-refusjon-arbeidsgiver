import React, { FunctionComponent, SetStateAction } from 'react';
import { useParams } from 'react-router';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { useHentRefusjon } from '../../services/rest-service';
import BEMHelper from '../../utils/bem';
import { formatterPeriode } from '../../utils/datoUtils';
import { Refusjon } from '../refusjon';

import { Heading, TextField } from '@navikt/ds-react';

const TilskuddssatsVTAO: FunctionComponent = () => {
    const cls = BEMHelper('refusjonside');
    const { refusjonId } = useParams();
    const refusjon: Refusjon = useHentRefusjon(refusjonId);
    const { tilskuddsgrunnlag } = refusjon.refusjonsgrunnlag;

    return (
        <div className={cls.element('inntekter-fra-tiltaket-boks')}>
            <Heading level="3" size="small">
                Refusjon for {formatterPeriode(tilskuddsgrunnlag.tilskuddFom, tilskuddsgrunnlag.tilskuddTom)}
            </Heading>
            <VerticalSpacer rem={1} />
            <TextField label="Månedlig tilskuddssats" description="Sats for 2024" value="6 808 kr" readOnly />
        </div>
    );
};

export default TilskuddssatsVTAO;
