import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { BedriftvalgType, initPageData } from '../api/organisasjon';
import BEMHelper from '../../../utils/bem';
import { MenyContext } from '../BedriftsmenyRefusjon';
import { setDefaultBedriftlisteMedApneElementer } from '../api/api-Utils';

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
                            valgtOrg: [organisasjonstre?.at(0)?.Underenheter?.at(0)],
                            pageData: initPageData,
                        });
                        setBedriftvalg(valg);
                        if (callbackAlleClick) setValgtBedrift(valg);
                        setDefaultBedriftlisteMedApneElementer(organisasjonstre, setBedriftListe);
                    }}
                />
                <Radio
                    label="Velg flere bedrifter"
                    name="Velg flere bedrifter"
                    checked={bedriftvalg.type === BedriftvalgType.FLEREBEDRIFTER}
                    onChange={() => {
                        const valg = Object.assign({}, bedriftvalg, {
                            type: BedriftvalgType.FLEREBEDRIFTER,
                            valgtOrg: [organisasjonstre?.at(0)?.Underenheter?.at(0)],
                            pageData: initPageData,
                        });
                        setBedriftvalg(valg);
                        if (callbackAlleClick) setValgtBedrift(valg);
                        setDefaultBedriftlisteMedApneElementer(organisasjonstre, setBedriftListe);
                    }}
                />
                <Radio
                    label="Velg alle bedrifter"
                    name="Velg alle bedrifter"
                    checked={bedriftvalg.type === BedriftvalgType.ALLEBEDRIFTER}
                    onChange={() => {
                        const valg = Object.assign({}, bedriftvalg, {
                            type: BedriftvalgType.ALLEBEDRIFTER,
                            valgtOrg: organisasjonstre?.flatMap((e) => e.Underenheter),
                            pageData: initPageData,
                        });
                        setBedriftvalg(valg);
                        if (callbackAlleClick) setValgtBedrift(valg);
                        setDefaultBedriftlisteMedApneElementer(organisasjonstre, setBedriftListe);
                    }}
                />
            </RadioGruppe>
        </div>
    );
};
export default RadioValg;
