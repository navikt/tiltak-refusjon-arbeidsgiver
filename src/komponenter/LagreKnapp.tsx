import React, { FunctionComponent, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { Nettressurs, Status } from '../nettressurs';
import { handterFeil } from '../utils/apiFeilUtils';
import VerticalSpacer from './VerticalSpacer';
import { Alert, Button, ButtonProps } from '@navikt/ds-react';

type Props = {
    lagreFunksjon: () => Promise<void>;
    attributes?: ButtonProps & HTMLAttributes<HTMLDivElement>;
};

const LagreKnapp: FunctionComponent<Props & ButtonProps> = (props) => {
    const [netverkStatus, setNetverkStatus] = useState<Nettressurs<any>>({ status: Status.IkkeLastet });
    const [feilmelding, setFeilmelding] = useState('');

    const knappBaseProps = Object.assign({}, props);
    const feilRef = useRef<HTMLDivElement>(null);

    const onClick = async () => {
        try {
            setNetverkStatus({ status: Status.LasterInn });
            await props.lagreFunksjon().then(() => setNetverkStatus({ status: Status.Sendt }));
        } catch (error: any) {
            setNetverkStatus({ status: Status.Feil, error: error.feilmelding ?? 'Uventet feil' });
            handterFeil(error, setFeilmelding);
        }
    };

    useEffect(() => {
        if (netverkStatus.status === Status.Feil) {
            feilRef.current?.focus();
        }
    }, [netverkStatus.status]);

    return (
        <div>
            <Button
                loading={netverkStatus.status === Status.LasterInn}
                disabled={netverkStatus.status === Status.LasterInn}
                onClick={onClick}
                {...knappBaseProps.attributes}
            >
                {props.children}
            </Button>
            {netverkStatus.status === Status.Feil && (
                <>
                    <VerticalSpacer rem={0.5} />
                    <Alert variant="warning" size="small">
                        <div ref={feilRef} aria-live="polite">
                            {feilmelding}
                        </div>
                    </Alert>
                </>
            )}
        </div>
    );
};

export default LagreKnapp;
