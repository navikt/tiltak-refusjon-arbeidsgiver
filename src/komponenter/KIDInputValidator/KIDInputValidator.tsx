import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { RefusjonContext } from '../../RefusjonProvider';
import { useParams } from 'react-router';
import { lagreBedriftKID } from '../../services/rest-service';
import validator from 'norsk-validator';
import { useHentRefusjon } from '../../services/rest-service';
import './KIDInputValidator.less';
import { TextField } from '@navikt/ds-react';

const KIDInputValidator: FunctionComponent = () => {
    const { refusjonId } = useParams();
    //const refusjon = useHentRefusjon(refusjonId);

    const refusjonContext = useContext(RefusjonContext);
    const { refusjon, feilListe, setFeilListe } = useContext(RefusjonContext);

    const [kid, setKid] = useState<string>();

    const fjerneFeilmelding = (value: string) => {
        const nyFeilListe = feilListe.filter((item) => {
            return item !== value;
        });
        setFeilListe(nyFeilListe);
    };

    useEffect(() => {
        if (refusjon?.refusjonsgrunnlag?.bedriftKid && kid !== refusjon.refusjonsgrunnlag.bedriftKid) {
            setKid(refusjon.refusjonsgrunnlag.bedriftKid);
        }
    }, []);
    /*
    if (refusjonContext.refusjon.refusjonsgrunnlag!.bedriftKid != null) {
        console.log('refusjon', refusjon.refusjonsgrunnlag);
    }
*/
    console.log('refusjonContext', refusjonContext.refusjon);

    console.log('feilListe', feilListe);

    return (
        <>
            <TextField
                label={''}
                placeholder="Kidnummer"
                value={kid}
                type="number"
                onChange={(event) => {
                    setKid(event.currentTarget.value.trim());
                }}
                onBlur={() => {
                    if (kid?.length === 0) {
                        setKid(undefined);
                        refusjonContext.settRefusjonsgrunnlagVerdi('bedriftKid', undefined);
                    }
                    setKid(kid);
                    lagreBedriftKID(refusjonId!, kid);
                    refusjonContext.settRefusjonsgrunnlagVerdi('bedriftKid', kid);
                    fjerneFeilmelding('bedriftKid');
                    if (kid !== undefined && kid?.length > 0 && !validator.kidnummer(kid)) {
                        if (!feilListe.includes('bedriftKid')) {
                            setFeilListe([...feilListe, 'bedriftKid']);
                        }
                        lagreBedriftKID(refusjonId!, kid);
                    }
                    //} else {
                    //   fjerneFeilmelding('bedriftKid');
                    //   refusjonContext.settRefusjonsgrunnlagVerdi('bedriftKid', undefined);
                    //}
                }}
                error={feilListe.includes('bedriftKid') && <li style={{ color: 'red' }}>Feil Kid Nummer</li>}
            />
            {/*error && <AlertStripe type="feil">Skriv innn riktig kid </AlertStripe>*/}
        </>
    );
};
export default KIDInputValidator;
