import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { BedriftvalgType } from '../api/organisasjon';
import BEMHelper from '../../../utils/bem';
import { MenyContext } from '../BedriftsmenyRefusjon';

interface Properties {
    className: string;
}

const RadioValg: FunctionComponent<Properties> = (props: PropsWithChildren<Properties>) => {
    const { className } = props;
    const cls = BEMHelper(className);
    const context = useContext(MenyContext);
    const { bedriftvalg, setBedriftvalg, organisasjonstre } = context;

    return (
        <div className={cls.element('radiovalg-av-bedrift')}>
            <RadioGruppe legend="Bedriftvalg">
                <Radio
                    label={'Velg en bedrift'}
                    name={'Velg en bedrift'}
                    checked={bedriftvalg.type === BedriftvalgType.ENKELBEDRIFT}
                    onChange={() => {
                        setBedriftvalg(
                            Object.assign({}, bedriftvalg, { type: BedriftvalgType.ENKELBEDRIFT, valgtOrg: [] })
                        );
                    }}
                />
                <Radio
                    label={'Velg flere bedrifter'}
                    name={'Velg flere bedrifter'}
                    checked={bedriftvalg.type === BedriftvalgType.FLEREBEDRIFTER}
                    onChange={() => {
                        setBedriftvalg(
                            Object.assign({}, bedriftvalg, {
                                type: BedriftvalgType.FLEREBEDRIFTER,
                                valgtOrg: [],
                            })
                        );
                    }}
                />
                <Radio
                    label={'Velg alle bedrifter'}
                    name={'Velg alle bedrifter'}
                    checked={bedriftvalg.type === BedriftvalgType.ALLEBEDRIFTER}
                    onChange={() => {
                        setBedriftvalg(
                            Object.assign({}, bedriftvalg, {
                                type: BedriftvalgType.ALLEBEDRIFTER,
                                valgtOrg: organisasjonstre?.flatMap((e) => e.Underenheter),
                            })
                        );
                    }}
                />
            </RadioGruppe>
        </div>
    );
};
export default RadioValg;
