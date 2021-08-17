import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';

type Props = {
    isOpen: boolean;
    lukkModal: () => void;
    godkjenn: () => void;
};

const GodkjennModal: FunctionComponent<Props> = (props) => {
    return (
        <Modal isOpen={props.isOpen} onRequestClose={() => props.lukkModal()} contentLabel="">
            <div style={{ margin: '2rem' }}>
                <Normaltekst>Er du sikker?</Normaltekst>
                <Knapp onClick={props.godkjenn}>Fullfør</Knapp>
            </div>
        </Modal>
    );
};

export default GodkjennModal;
