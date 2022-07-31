import { NavigateFunction } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Bedriftvalg, BedriftvalgType } from './api';

const useNavigation = (valgtBedrift: Bedriftvalg | undefined) => {
    if (valgtBedrift) {
        const navigate: NavigateFunction = useNavigate();

        const getBedriftSearchkey = (org: Bedriftvalg): string => {
            if (org?.type === BedriftvalgType.ALLEBEDRIFTER) {
                return BedriftvalgType.ALLEBEDRIFTER;
            }
            return org?.valgtOrg.map((o) => o.OrganizationNumber).join(',');
        };

        const valgtOrgUrlSulfix: string = getBedriftSearchkey(valgtBedrift);

        navigate({
            pathname: window.location.pathname,
            search: 'bedrift=' + valgtOrgUrlSulfix,
        });
    }
};
export default useNavigation;
