import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { RefusjonContext } from '../../RefusjonProvider';
import { useParams } from 'react-router';
import { lagreBedriftKID } from '../../services/rest-service';
import BEMHelper from '../../utils/bem';
import validator from 'norsk-validator';

import './KIDInputValidator.less';
import { TextField } from '@navikt/ds-react';

const KIDInputValidator: FunctionComponent = () => {
    const cls = BEMHelper('kidValidator');
    const { refusjonId } = useParams();
    const refusjonContext = useContext(RefusjonContext);
    const { refusjon, feilListe, setFeilListe } = useContext(RefusjonContext);

    const [kid, setKid] = useState<string | undefined>(refusjon?.refusjonsgrunnlag?.bedriftKid);

    const bedriftKidRegex = /^0+$/; // Sjekker at tallet er 0 eller flere 0000000

    const fjerneFeilmelding = (value: string) => {
        const nyFeilListe = feilListe.filter((item) => {
            return item !== value;
        });
        setFeilListe(nyFeilListe);
    };

    useEffect(() => {
        if (refusjon?.refusjonsgrunnlag?.bedriftKid !== undefined) {
            if (
                refusjon.refusjonsgrunnlag.bedriftKid?.length > 0 &&
                (!validator.kidnummer(refusjon.refusjonsgrunnlag.bedriftKid) ||
                    bedriftKidRegex.test(refusjon?.refusjonsgrunnlag?.bedriftKid!))
            ) {
                if (!feilListe.includes('bedriftKid')) {
                    setFeilListe([...feilListe, 'bedriftKid']);
                }
            } else {
                fjerneFeilmelding('bedriftKid');
            }
            setKid(refusjon.refusjonsgrunnlag.bedriftKid);
        }
        // eslint-disable-next-line
    }, [refusjon?.refusjonsgrunnlag?.bedriftKid]);

    return (
        <>
            <TextField
                className={cls.element('textField')}
                hideLabel
                label={'KID-nummer'}
                placeholder="KID-nummer"
                value={kid}
                size="small"
                type="number"
                onFocus={() => fjerneFeilmelding('bedriftKid')}
                onChange={(event) => {
                    setKid(event.currentTarget.value.trim());
                }}
                onBlur={() => {
                    if (kid?.length === 0) {
                        setKid(undefined);
                        refusjonContext.settRefusjonsgrunnlagVerdi('bedriftKid', undefined);
                        fjerneFeilmelding('bedriftKid');
                    }
                    setKid(kid);
                    lagreBedriftKID(refusjonId!, kid);
                    refusjonContext.settRefusjonsgrunnlagVerdi('bedriftKid', kid);
                }}
                error={feilListe.includes('bedriftKid') && <>Feil KID-nummer</>}
            />
        </>
    );
};
export default KIDInputValidator;
