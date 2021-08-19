import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Innholdstittel } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import VerticalSpacer from '../../komponenter/VerticalSpacer';

type Props = {
    isOpen: boolean;
    lukkModal: () => void;
    godkjenn: () => void;
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Hovedknapp onClick={props.godkjenn}>Send inn</Hovedknapp>
                    <Knapp onClick={() => props.lukkModal()}>Avbryt</Knapp>
                </div>
            </div>
        </Modal>
    );
};

export default GodkjennModal;
