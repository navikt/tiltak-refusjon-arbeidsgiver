import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { BedriftvalgType, initPageData, Organisasjonlist } from '../api/api';
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
        setDefaultBedriftlisteMedApneElementer(organisasjonstre?.list, setBedriftListe);
    };

    return (
        <div className={cls.element('radiovalg-av-bedrift')}>
            <RadioGruppe legend="Bedriftvalg">
                <Radio
                    label="Velg en bedrift"
                    name="Velg en bedrift"
                    checked={bedriftvalg.type === BedriftvalgType.ENKELBEDRIFT}
                    onChange={() => byttRadioValg(BedriftvalgType.ENKELBEDRIFT)}
                />
                <Radio
                    label="Velg flere bedrifter"
                    name="Velg flere bedrifter"
                    checked={bedriftvalg.type === BedriftvalgType.FLEREBEDRIFTER}
                    onChange={() => byttRadioValg(BedriftvalgType.FLEREBEDRIFTER)}
                />
                <Radio
                    label="Velg alle bedrifter"
                    name="Velg alle bedrifter"
                    checked={bedriftvalg.type === BedriftvalgType.ALLEBEDRIFTER}
                    onChange={() => byttRadioValg(BedriftvalgType.ALLEBEDRIFTER)}
                />
            </RadioGruppe>
        </div>
    );
};
export default RadioValg;
