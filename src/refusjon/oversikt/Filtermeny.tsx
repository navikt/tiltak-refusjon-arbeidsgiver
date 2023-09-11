import React, { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import { statusTekst } from '../../messages';
import { brukerflate } from '../../utils/amplitude-utils';
import { storForbokstav } from '../../utils/stringUtils';
import { RefusjonStatus } from '../status';
import { Tiltak } from '../tiltak';
import { useFilter } from './FilterContext';
import { ExpansionCard, Radio, RadioGroup } from '@navikt/ds-react';
import PagnationAntallValg from '../OversiktSide/PaginationAntallValg';

const Filtermeny: FunctionComponent = () => {
    const { filter, oppdaterFilter } = useFilter();
    const erDesktopStorrelse = useMediaQuery({ minWidth: 768 });
    brukerflate(erDesktopStorrelse);
    return (
        <div role="menubar" aria-label="filtermeny for filtrering av refusjon på status og tiltakstype">
            <ExpansionCard size="small" aria-label="Small-variant" defaultOpen={true}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title size="small">Status</ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content style={{ paddingTop: '0' }}>
                    <RadioGroup legend="" value={filter.status || ''} size="small">
                        <Radio
                            role="radio"
                            value=""
                            name={'status'}
                            onChange={() => oppdaterFilter({ status: undefined })}
                        >
                            Alle
                        </Radio>
                        <Radio
                            role="radio"
                            value={RefusjonStatus.FOR_TIDLIG}
                            name={'status'}
                            onChange={() => oppdaterFilter({ status: RefusjonStatus.FOR_TIDLIG })}
                        >
                            {storForbokstav(statusTekst[RefusjonStatus.FOR_TIDLIG])}
                        </Radio>
                        <Radio
                            role="radio"
                            value={RefusjonStatus.KLAR_FOR_INNSENDING}
                            name={'status'}
                            onChange={() => oppdaterFilter({ status: RefusjonStatus.KLAR_FOR_INNSENDING })}
                        >
                            {storForbokstav(statusTekst[RefusjonStatus.KLAR_FOR_INNSENDING])}
                        </Radio>
                        <Radio
                            role="radio"
                            value={RefusjonStatus.ANNULLERT}
                            name={'status'}
                            onChange={() => oppdaterFilter({ status: RefusjonStatus.ANNULLERT })}
                        >
                            {storForbokstav(statusTekst[RefusjonStatus.ANNULLERT])}
                        </Radio>
                        <Radio
                            role="radio"
                            value={RefusjonStatus.SENDT_KRAV}
                            name={'status'}
                            onChange={() => oppdaterFilter({ status: RefusjonStatus.SENDT_KRAV })}
                        >
                            {storForbokstav(statusTekst[RefusjonStatus.SENDT_KRAV])}
                        </Radio>
                        <Radio
                            role="radio"
                            value={RefusjonStatus.UTBETALT}
                            name={'status'}
                            onChange={() => oppdaterFilter({ status: RefusjonStatus.UTBETALT })}
                        >
                            {storForbokstav(statusTekst[RefusjonStatus.UTBETALT])}
                        </Radio>
                        <Radio
                            role="radio"
                            value={RefusjonStatus.UTGÅTT}
                            name={'status'}
                            onChange={() => oppdaterFilter({ status: RefusjonStatus.UTGÅTT })}
                        >
                            {storForbokstav(statusTekst[RefusjonStatus.UTGÅTT])}
                        </Radio>
                        <Radio
                            role="radio"
                            value={RefusjonStatus.UTBETALING_FEILET}
                            name={'status'}
                            onChange={() => oppdaterFilter({ status: RefusjonStatus.UTBETALING_FEILET })}
                        >
                            {storForbokstav(statusTekst[RefusjonStatus.UTBETALING_FEILET])}
                        </Radio>
                    </RadioGroup>
                </ExpansionCard.Content>
            </ExpansionCard>
            <div style={{ marginTop: '0.75rem' }} />
            <ExpansionCard size="small" aria-label="Small-variant" defaultOpen={true}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title size="small">Tiltakstype</ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content style={{ paddingTop: '0' }}>
                    <RadioGroup legend="" value={filter.tiltakstype || ''} size="small">
                        <Radio
                            role="radio"
                            value={''}
                            name="ALLE"
                            checked={filter.tiltakstype === undefined}
                            onChange={() => oppdaterFilter({ tiltakstype: undefined })}
                        >
                            Alle
                        </Radio>
                        <Radio
                            role="radio"
                            value={Tiltak.MIDLERTIDIG_LØNNSTILSKUDD}
                            name={Tiltak.MIDLERTIDIG_LØNNSTILSKUDD}
                            onChange={() => oppdaterFilter({ tiltakstype: Tiltak.MIDLERTIDIG_LØNNSTILSKUDD })}
                        >
                            Midlertidig lønnstilskudd
                        </Radio>
                        <Radio
                            role="radio"
                            value={Tiltak.VARIG_LØNNSTILSKUDD}
                            name={Tiltak.VARIG_LØNNSTILSKUDD}
                            onChange={() => oppdaterFilter({ tiltakstype: Tiltak.VARIG_LØNNSTILSKUDD })}
                        >
                            Varig lønnstilskudd
                        </Radio>
                        <Radio
                            role="radio"
                            value={Tiltak.SOMMERJOBB}
                            name={Tiltak.SOMMERJOBB}
                            onChange={() => oppdaterFilter({ tiltakstype: Tiltak.SOMMERJOBB })}
                        >
                            Sommerjobb
                        </Radio>
                    </RadioGroup>
                </ExpansionCard.Content>
            </ExpansionCard>
            <PagnationAntallValg />
        </div>
    );
};

export default Filtermeny;
