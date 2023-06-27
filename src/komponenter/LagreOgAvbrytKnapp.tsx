import React, { FunctionComponent, HTMLAttributes, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Nettressurs, Status } from '../nettressurs';
import { handterFeil } from '../utils/apiFeilUtils';
import VerticalSpacer from './VerticalSpacer';
import { Alert, Button, ButtonProps } from '@navikt/ds-react';

type Props = {
    lagreFunksjon: () => Promise<any>;
    avbryt: () => void;
    attributes?: ButtonProps & HTMLAttributes<HTMLDivElement>;
};

const LagreOgAvbrytKnapp: FunctionComponent<Props & ButtonProps> = (props: PropsWithChildren<Props & ButtonProps>) => {
    const [oppslag, setOppslag] = useState<Nettressurs<any>>({ status: Status.IkkeLastet });
    const [feilmelding, setFeilmelding] = useState('');

    const knappBaseProps = Object.assign({}, props.attributes);
    const feilRef = useRef<HTMLDivElement>(null);

    const onClick = async () => {
        try {
            setOppslag({ status: Status.LasterInn });
            await props.lagreFunksjon().then(() => setOppslag({ status: Status.Sendt }));
        } catch (error: any) {
            setOppslag({ status: Status.Feil, error: error.feilmelding ?? 'Uventet feil' });
            handterFeil(error, setFeilmelding);
        }
    };

    useEffect(() => {
        if (oppslag.status === Status.Feil) {
            feilRef.current?.focus();
        }
    }, [oppslag.status]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    disabled={oppslag.status === Status.LasterInn}
                    onClick={onClick}
                    variant="primary"
                    {...knappBaseProps}
                >
                    {props.children ?? ''}
                </Button>
                <Button onClick={props.avbryt}>Avbryt</Button>
            </div>
            {oppslag.status === Status.Feil && (
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

export default LagreOgAvbrytKnapp;
