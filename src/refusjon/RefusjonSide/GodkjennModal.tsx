import Modal from 'nav-frontend-modal';
import { Innholdstittel } from 'nav-frontend-typografi';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import LagreOgAvbrytKnapp from '../../komponenter/LagreOgAvbrytKnapp';
import VerticalSpacer from '../../komponenter/VerticalSpacer';

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
        <Modal isOpen={isOpen} onRequestClose={() => lukkModal()} contentLabel="">
            <div style={{ margin: '2rem', maxWidth: '40rem' }}>
                <Innholdstittel style={{ textAlign: 'center' }}>{tittel}</Innholdstittel>
                <VerticalSpacer rem={2} />
                {children}
                <VerticalSpacer rem={2} />
                <LagreOgAvbrytKnapp lagreFunksjon={godkjenn} avbryt={() => lukkModal()}>
                    Send inn
                </LagreOgAvbrytKnapp>
            </div>
        </Modal>
    );
};

export default GodkjennModal;
