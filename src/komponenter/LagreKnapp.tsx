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
    const [oppslag, setOppslag] = useState<Nettressurs<any>>({ status: Status.IkkeLastet });
    const [feilmelding, setFeilmelding] = useState('');

    const knappBaseProps = Object.assign({}, props);
    //delete knappBaseProps['lagreFunksjon'];

    const feilRef = useRef<HTMLDivElement>(null);

    const onClick = async () => {
        try {
            setOppslag({ status: Status.LasterInn });
            await props.lagreFunksjon();
            setOppslag({ status: Status.Sendt });
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
            <KnappBase
                spinner={oppslag.status === Status.LasterInn}
                disabled={oppslag.status === Status.LasterInn}
                onClick={onClick}
                {...knappBaseProps.attributes}
            />
            {oppslag.status === Status.Feil && (
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
