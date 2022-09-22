import moment from 'moment';
import { FunctionComponent } from 'react';
import { Refusjon } from '../../../refusjon';

type Props = {
    refusjon: Refusjon;
};

const InntektsmeldingTabellHeader: FunctionComponent<Props> = (props) => {
    const månedNavn = moment(props.refusjon.refusjonsgrunnlag.tilskuddsgrunnlag.tilskuddFom).format('MMMM');

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
