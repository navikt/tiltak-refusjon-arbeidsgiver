import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { BedriftvalgType, initPageData, Organisasjonlist } from '../api/api';
import BEMHelper from '../../../utils/bem';
import { MenyContext } from '../BedriftsmenyRefusjon';
import { setDefaultBedriftlisteMedApneLabeler } from '../api/kontruer-Utils';
import { Radio, RadioGroup } from '@navikt/ds-react';

interface Properties {
    className: string;
}

const RadioValg: FunctionComponent<Properties> = (props: PropsWithChildren<Properties>) => {
    const { className } = props;
    const cls = BEMHelper(className);
    const context = useContext(MenyContext);
    const {
        bedriftvalg,
        setBedriftvalg,
        organisasjonstre,
        setOrganisasjonstre,
        setBedriftListe,
        setValgtBedrift,
        callbackAlleClick,
        setSokefelt,
        sokefelt,
    } = context;

    const getNyttValgtOrg = (bedriftvalgType: BedriftvalgType, orgtre: Organisasjonlist | undefined) => {
        if (bedriftvalgType === BedriftvalgType.ALLEBEDRIFTER) {
            return orgtre?.list?.flatMap((e) => e.Underenheter);
        }
        return [orgtre?.list?.at(0)?.Underenheter?.at(0)];
    };

    const byttRadioValg = (bedriftvalgType: BedriftvalgType) => {
        const orgtre: Organisasjonlist | undefined = sokefelt.aktivt ? sokefelt.fultOrganisasjonstre : organisasjonstre;
        const bedriftValg = getNyttValgtOrg(bedriftvalgType, orgtre);
        if (sokefelt.aktivt) {
            setSokefelt({
                aktivt: false,
                sokeord: '',
                antallTreff: 0,
                organisasjonstreTreff: undefined,
                fultOrganisasjonstre: undefined,
            });
        }
        const valg = Object.assign({}, bedriftvalg, {
            type: bedriftvalgType,
            valgtOrg: bedriftValg,
            pageData: initPageData,
        });
        setBedriftvalg(valg);
        if (callbackAlleClick) setValgtBedrift(valg);
        setOrganisasjonstre(orgtre);
        setDefaultBedriftlisteMedApneLabeler(organisasjonstre?.list, setBedriftListe);
    };

    return (
        <div className={cls.element('radiovalg-av-bedrift')}>
            <RadioGroup legend="Bedriftvalg">
                <Radio
                    value="Velg en bedrift"
                    name="Velg en bedrift"
                    checked={bedriftvalg.type === BedriftvalgType.ENKELBEDRIFT}
                    onChange={() => byttRadioValg(BedriftvalgType.ENKELBEDRIFT)}
                >
                    Velg en bedrift
                </Radio>
                <Radio
                    value="Velg flere bedrifter"
                    name="Velg flere bedrifter"
                    checked={bedriftvalg.type === BedriftvalgType.FLEREBEDRIFTER}
                    onChange={() => byttRadioValg(BedriftvalgType.FLEREBEDRIFTER)}
                >
                    Velg flere bedrifter
                </Radio>
                <Radio
                    value="Velg alle bedrifter"
                    name="Velg alle bedrifter"
                    checked={bedriftvalg.type === BedriftvalgType.ALLEBEDRIFTER}
                    onChange={() => byttRadioValg(BedriftvalgType.ALLEBEDRIFTER)}
                >
                    Velg alle bedrifter
                </Radio>
            </RadioGroup>
        </div>
    );
};
export default RadioValg;
