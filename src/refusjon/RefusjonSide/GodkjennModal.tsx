import React, { FunctionComponent, PropsWithChildren } from 'react';
import LagreOgAvbrytKnapp from '../../komponenter/LagreOgAvbrytKnapp';
import VerticalSpacer from '../../komponenter/VerticalSpacer';
import { Modal, Heading } from '@navikt/ds-react';

type Props = {
    isOpen: boolean;
    lukkModal: () => void;
    godkjenn: () => Promise<void>;
    tittel: string;
    children: React.ReactNode;
};

const GodkjennModal: FunctionComponent<Props> = ({
    isOpen,
    godkjenn,
    lukkModal,
    tittel,
    children,
}: PropsWithChildren<Props>) => {
    return (
        <Modal open={isOpen} onClose={() => lukkModal()} aria-label="">
            <Modal.Body>
                <div style={{ margin: '2rem', maxWidth: '40rem' }}>
                    <Heading size="large" style={{ textAlign: 'center' }}>
                        {tittel}
                    </Heading>
                    <VerticalSpacer rem={2} />
                    {children}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <LagreOgAvbrytKnapp lagreFunksjon={godkjenn} avbryt={() => lukkModal()}>
                    Send inn
                </LagreOgAvbrytKnapp>
            </Modal.Footer>
        </Modal>
    );
};

export default GodkjennModal;
