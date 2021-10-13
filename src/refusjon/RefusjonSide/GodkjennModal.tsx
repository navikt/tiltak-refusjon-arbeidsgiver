import Modal from 'nav-frontend-modal';
import { Innholdstittel } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import LagreOgAvbrytKnapp from '../../komponenter/LagreOgAvbrytKnapp';
import VerticalSpacer from '../../komponenter/VerticalSpacer';

type Props = {
    isOpen: boolean;
    lukkModal: () => void;
    godkjenn: () => Promise<any>;
    tittel: string;
};

const GodkjennModal: FunctionComponent<Props> = (props) => {
    return (
        <Modal isOpen={props.isOpen} onRequestClose={() => props.lukkModal()} contentLabel="">
            <div style={{ margin: '2rem', maxWidth: '40rem' }}>
                <Innholdstittel style={{ textAlign: 'center' }}>{props.tittel}</Innholdstittel>
                <VerticalSpacer rem={2} />
                {props.children}
                <VerticalSpacer rem={2} />
                <LagreOgAvbrytKnapp lagreFunksjon={props.godkjenn} avbryt={() => props.lukkModal()}>
                    Send inn
                </LagreOgAvbrytKnapp>
            </div>
        </Modal>
    );
};

export default GodkjennModal;
