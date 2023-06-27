import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { BodyShort } from '@navikt/ds-react';
import HvitBoks from '../../komponenter/hvitboks/HvitBoks';
import { Loader } from '@navikt/ds-react';

import React, { FunctionComponent } from 'react';

const HenterInntekterBoks: FunctionComponent = () => {
    return (
        <HvitBoks style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Loader type="XL" />
            <VerticalSpacer rem={1} />
            <BodyShort size="small">Henter inntektsopplysninger fra a-meldingen...</BodyShort>
        </HvitBoks>
    );
};

export default HenterInntekterBoks;
