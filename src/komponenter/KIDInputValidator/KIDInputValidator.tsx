import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { lagreBedriftKID } from '../../services/rest-service';
import validator from 'norsk-validator';
import AlertStripe from 'nav-frontend-alertstriper';
import { useHentRefusjon } from '../../services/rest-service';
import './KIDInputValidator.less';
import BEMHelper from '../../utils/bem';
//import { TextField } from '@navikt/ds-react';

const cls = BEMHelper('utregning-rad');

const KIDInputValidator = () => {
    const { refusjonId } = useParams();
    const refusjon = useHentRefusjon(refusjonId);

    const [kid, setKID] = useState<string | undefined>(refusjon.refusjonsgrunnlag.bedriftKid);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setKID(refusjon.refusjonsgrunnlag.bedriftKid);
    }, []);

    return (
        <>
            {/*
            <TextField
                label={''}
                placeholder="Kidnummer"
                value={kid}
                type="number"
                onChange={(event) => {
                    setKID(event.currentTarget.value.trim());
                }}
                onBlur={() => {
                    if (validator.kidnummer(kid)) {
                        lagreBedriftKID(refusjonId!, kid);
                        setError(false);
                    } else {
                        setError(true);
                    }
                }}
                error={'Hvorfor er du ikke rød'}
            />
            {/*error && <AlertStripe type="feil">Skriv innn riktig kid </AlertStripe>*/}
        </>
    );
};
export default KIDInputValidator;
