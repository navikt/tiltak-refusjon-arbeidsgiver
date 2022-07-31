import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { BedriftvalgType, initPageData } from '../api/api';
import BEMHelper from '../../../utils/bem';
import { MenyContext } from '../BedriftsmenyRefusjon';
import { setDefaultBedriftlisteMedApneElementer } from '../api/kontruer-Utils';

interface Properties {
    className: string;
}

const RadioValg: FunctionComponent<Properties> = (props: PropsWithChildren<Properties>) => {
    const { className } = props;
    const cls = BEMHelper(className);
    const context = useContext(MenyContext);
    const { bedriftvalg, setBedriftvalg, organisasjonstre, setBedriftListe, setValgtBedrift, callbackAlleClick } =
        context;

    return (
        <div className={cls.element('radiovalg-av-bedrift')}>
            <RadioGruppe legend="Bedriftvalg">
                <Radio
                    label="Velg en bedrift"
                    name="Velg en bedrift"
                    checked={bedriftvalg.type === BedriftvalgType.ENKELBEDRIFT}
                    onChange={() => {
                        const valg = Object.assign({}, bedriftvalg, {
                            type: BedriftvalgType.ENKELBEDRIFT,
                            valgtOrg: [organisasjonstre?.list?.at(0)?.Underenheter?.at(0)],
                            pageData: initPageData,
                        });
                        setBedriftvalg(valg);
                        if (callbackAlleClick) setValgtBedrift(valg);
                        setDefaultBedriftlisteMedApneElementer(organisasjonstre?.list, setBedriftListe);
                    }}
                />
                <Radio
                    label="Velg flere bedrifter"
                    name="Velg flere bedrifter"
                    checked={bedriftvalg.type === BedriftvalgType.FLEREBEDRIFTER}
                    onChange={() => {
                        const valg = Object.assign({}, bedriftvalg, {
                            type: BedriftvalgType.FLEREBEDRIFTER,
                            valgtOrg: [organisasjonstre?.list?.at(0)?.Underenheter?.at(0)],
                            pageData: initPageData,
                        });
                        setBedriftvalg(valg);
                        if (callbackAlleClick) setValgtBedrift(valg);
                        setDefaultBedriftlisteMedApneElementer(organisasjonstre?.list, setBedriftListe);
                    }}
                />
                <Radio
                    label="Velg alle bedrifter"
                    name="Velg alle bedrifter"
                    checked={bedriftvalg.type === BedriftvalgType.ALLEBEDRIFTER}
                    onChange={() => {
                        const valg = Object.assign({}, bedriftvalg, {
                            type: BedriftvalgType.ALLEBEDRIFTER,
                            valgtOrg: organisasjonstre?.list?.flatMap((e) => e.Underenheter),
                            pageData: initPageData,
                        });
                        setBedriftvalg(valg);
                        if (callbackAlleClick) setValgtBedrift(valg);
                        setDefaultBedriftlisteMedApneElementer(organisasjonstre?.list, setBedriftListe);
                    }}
                />
            </RadioGruppe>
        </div>
    );
};
export default RadioValg;
