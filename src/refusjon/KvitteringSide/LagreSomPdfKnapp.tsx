import { File } from '@navikt/ds-icons/cjs';
import React, { FunctionComponent } from 'react';
import { Button } from '@navikt/ds-react';

const LagreSomPdfKnapp: FunctionComponent<{ avtaleId: string }> = (props) => {
    const href = `/api/arbeidsgiver/refusjon/${props.avtaleId}/pdf`;
    return (
        <Button
            style={{ minWidth: '12rem' }}
            icon={<File aria-hidden />}
            variant="secondary"
            onClick={() => {
                window.open(href);
            }}
        >
            Lagre som PDF
        </Button>
    );
};

export default LagreSomPdfKnapp;
