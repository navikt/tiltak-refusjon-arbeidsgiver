import React, { FunctionComponent, PropsWithChildren } from 'react';
import LagreOgAvbrytKnapp from '../../komponenter/LagreOgAvbrytKnapp';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { Modal, Heading } from '@navikt/ds-react';

type Props = {
    isOpen: boolean;
    lukkModal: () => void;
    godkjenn: () => Promise<void>;
    tittel: string;
};

const GodkjennModal: FunctionComponent<Props> = ({
    isOpen,
    godkjenn,
    lukkModal,
    tittel,
    children,
}: PropsWithChildren<Props>) => {
    const setModalElement = () => {
        if (document.getElementById('root')) return '#root';
        return 'body';
    };
    if (typeof window !== 'undefined') {
        Modal.setAppElement(setModalElement());
    }
    return (
        <Modal open={isOpen} onClose={() => lukkModal()} aria-label="">
            <Modal.Content>
                <div style={{ margin: '2rem', maxWidth: '40rem' }}>
                    <Heading size="large" style={{ textAlign: 'center' }}>
                        {tittel}
                    </Heading>
                    <VerticalSpacer rem={2} />
                    {children}
                    <VerticalSpacer rem={2} />
                    <LagreOgAvbrytKnapp lagreFunksjon={godkjenn} avbryt={() => lukkModal()}>
                        Send inn
                    </LagreOgAvbrytKnapp>
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default GodkjennModal;
