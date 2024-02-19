import { FunctionComponent } from 'react';
import { månedsNavn } from '../../../../utils/datoUtils';
import { Refusjonsgrunnlag } from '../../../refusjon';

type Props = {
    refusjonsgrunnlag: Refusjonsgrunnlag;
};

const InntektsmeldingTabellHeader: FunctionComponent<Props> = ({ refusjonsgrunnlag }) => {
    const månedNavn = månedsNavn(refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);

    return (
        <thead>
            <tr>
                <th>Beskriv&shy;else</th>
                <th>År/mnd</th>
                <th>Opptjenings&shy;periode</th>
                <th>Opptjent i {månedNavn}?</th>
                <th>Beløp</th>
            </tr>
        </thead>
    );
};
export default InntektsmeldingTabellHeader;
