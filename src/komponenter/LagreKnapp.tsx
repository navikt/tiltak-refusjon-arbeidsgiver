import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import KnappBase, { KnappBaseProps } from 'nav-frontend-knapper';
import React, { FunctionComponent, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { Nettressurs, Status } from '../nettressurs';
import { handterFeil } from '../utils/apiFeilUtils';
import VerticalSpacer from './VerticalSpacer';

type Props = {
    lagreFunksjon: () => Promise<void>;
    attributes?: KnappBaseProps & HTMLAttributes<HTMLDivElement>;
};

const LagreKnapp: FunctionComponent<Props & KnappBaseProps> = (props) => {
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
            <KnappBase
                spinner={netverkStatus.status === Status.LasterInn}
                disabled={netverkStatus.status === Status.LasterInn}
                onClick={onClick}
                {...knappBaseProps.attributes}
            >
                {props.children}
            </KnappBase>
            {netverkStatus.status === Status.Feil && (
                <>
                    <VerticalSpacer rem={0.5} />
                    <AlertStripeAdvarsel>
                        <div ref={feilRef} aria-live="polite">
                            {feilmelding}
                        </div>
                    </AlertStripeAdvarsel>
                </>
            )}
        </div>
    );
};

export default LagreKnapp;
