import { FunctionComponent } from 'react';
import { månedsNavn } from '../../../../utils/datoUtils';
import { Refusjon } from '../../../refusjon';

type Props = {
    refusjon: Refusjon;
};

const InntektsmeldingTabellHeader: FunctionComponent<Props> = (props) => {
    const månedNavn = månedsNavn(props.refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom);

    return (
        <thead>
            <tr>
                <th>Beskriv&shy;else</th>
                <th>År/mnd</th>
                <th>Rapportert opptjenings&shy;periode</th>
                <th>Opptjent i {månedNavn}?</th>
                <th>Beløp</th>
            </tr>
        </thead>
    );
};
export default InntektsmeldingTabellHeader;
