import React, { FunctionComponent, useContext } from 'react';
import { BedriftvalgType } from '../api/api';
import { ReactComponent as UnderEnhet } from '@/asset/image/underenhet.svg';
import BEMHelper from '../../../utils/bem';
import { MenyContext } from '../BedriftsmenyRefusjon';
import { Label, BodyShort } from '@navikt/ds-react';

const ValgteBedrifter: FunctionComponent = () => {
    const cls = BEMHelper('menyInnhold');
    const context = useContext(MenyContext);
    const { bedriftvalg } = context;

    return bedriftvalg.type !== BedriftvalgType.ENKELBEDRIFT && bedriftvalg.valgtOrg.length > 0 ? (
        <div className={cls.element('valgte-bedrifter')}>
            <Label className={cls.element('valgte-org-overskrift')}>Valgte bedrifter</Label>
            <div className={cls.element('valgte-bedrifter-innhold')}>
                <div style={{ marginRight: '0.5rem' }}>
                    {bedriftvalg.valgtOrg.map((e, i) => (
                        <div className={cls.element('valgte-bedrifter-rad')} key={i}>
                            <div className={cls.element('ikon')}>
                                <UnderEnhet />
                            </div>
                            <BodyShort size="small" className={cls.element('valgte-bedrifter-tekst')}>
                                org.nr {e.OrganizationNumber}
                            </BodyShort>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : null;
};
export default ValgteBedrifter;
