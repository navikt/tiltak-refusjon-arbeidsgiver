import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { statusTekst } from '../../messages';
import { brukerflate } from '../../utils/amplitude-utils';
import { storForbokstav } from '../../utils/stringUtils';
import { RefusjonStatus } from '../status';
import { Tiltak } from '../tiltak';
import { useFilter } from './FilterContext';
import BEMHelper from '../../utils/bem';
import PagnationValg from '../OversiktSide/pagination/PagnationValg';

const Filtermeny: FunctionComponent = () => {
    const cls = BEMHelper('OversiktSide');
    const { filter, oppdaterFilter } = useFilter();
    const erDesktopStorrelse = useMediaQuery({ minWidth: 768 });
    const [statusPanelOpen, setStatusPanelOpen] = useState(erDesktopStorrelse);
    const [tiltaksPanelOpen, setTiltaksPanelOpen] = useState(erDesktopStorrelse);
    brukerflate(erDesktopStorrelse);

    useEffect(() => {
        setStatusPanelOpen(erDesktopStorrelse);
        setTiltaksPanelOpen(erDesktopStorrelse);
    }, [setStatusPanelOpen, setTiltaksPanelOpen, erDesktopStorrelse]);

    return (
        <div role="menubar" aria-label="filtermeny for filtrering av refusjon på status og tiltakstype">
            <EkspanderbartpanelBase
                tittel="Status"
                role="radiogroup"
                className={cls.element('filtermeny-status')}
                apen={statusPanelOpen}
                collapseProps={{
                    open: statusPanelOpen,
                }}
                onClick={(event) => {
                    setStatusPanelOpen(!statusPanelOpen);
                }}
                style={{ minWidth: '14.375rem' }}
            >
                <RadioGruppe legend="">
                    <Radio
                        role="radio"
                        label="Alle"
                        checked={filter.status === undefined}
                        name={'status'}
                        onChange={() => oppdaterFilter({ status: undefined })}
                    />
                    <Radio
                        role="radio"
                        label={storForbokstav(statusTekst[RefusjonStatus.FOR_TIDLIG])}
                        checked={filter.status === RefusjonStatus.FOR_TIDLIG}
                        name={'status'}
                        onChange={() => oppdaterFilter({ status: RefusjonStatus.FOR_TIDLIG })}
                    />
                    <Radio
                        role="radio"
                        label={storForbokstav(statusTekst[RefusjonStatus.KLAR_FOR_INNSENDING])}
                        checked={filter.status === RefusjonStatus.KLAR_FOR_INNSENDING}
                        name={'status'}
                        onChange={() => oppdaterFilter({ status: RefusjonStatus.KLAR_FOR_INNSENDING })}
                    />
                    <Radio
                        role="radio"
                        label={storForbokstav(statusTekst[RefusjonStatus.ANNULLERT])}
                        checked={filter.status === RefusjonStatus.ANNULLERT}
                        name={'status'}
                        onChange={() => oppdaterFilter({ status: RefusjonStatus.ANNULLERT })}
                    />
                    <Radio
                        role="radio"
                        label={storForbokstav(statusTekst[RefusjonStatus.SENDT_KRAV])}
                        checked={filter.status === RefusjonStatus.SENDT_KRAV}
                        name={'status'}
                        onChange={() => oppdaterFilter({ status: RefusjonStatus.SENDT_KRAV })}
                    />
                    <Radio
                        role="radio"
                        label={storForbokstav(statusTekst[RefusjonStatus.UTBETALT])}
                        checked={filter.status === RefusjonStatus.UTBETALT}
                        name={'status'}
                        onChange={() => oppdaterFilter({ status: RefusjonStatus.UTBETALT })}
                    />
                    <Radio
                        role="radio"
                        label={storForbokstav(statusTekst[RefusjonStatus.UTGÅTT])}
                        checked={filter.status === RefusjonStatus.UTGÅTT}
                        name={'status'}
                        onChange={() => oppdaterFilter({ status: RefusjonStatus.UTGÅTT })}
                    />
                    <Radio
                        role="radio"
                        label={storForbokstav(statusTekst[RefusjonStatus.UTBETALING_FEILET])}
                        checked={filter.status === RefusjonStatus.UTBETALING_FEILET}
                        name={'status'}
                        onChange={() => oppdaterFilter({ status: RefusjonStatus.UTBETALING_FEILET })}
                    />
                </RadioGruppe>
            </EkspanderbartpanelBase>
            <div style={{ marginTop: '0.75rem' }} />
            <EkspanderbartpanelBase
                tittel="Tiltakstype"
                role="radiogroup"
                className={cls.element('filtermeny-tiltakstype')}
                apen={tiltaksPanelOpen}
                collapseProps={{ open: tiltaksPanelOpen }}
                onClick={() => setTiltaksPanelOpen(!tiltaksPanelOpen)}
                style={{ minWidth: '14.375rem' }}
            >
                <RadioGruppe legend="">
                    <Radio
                        role="radio"
                        label={'Alle'}
                        name="ALLE"
                        checked={filter.tiltakstype === undefined}
                        onChange={() => oppdaterFilter({ tiltakstype: undefined })}
                    />
                    <Radio
                        role="radio"
                        label={'Midlertidig lønnstilskudd'}
                        checked={filter.tiltakstype === Tiltak.MIDLERTIDIG_LØNNSTILSKUDD}
                        name={Tiltak.MIDLERTIDIG_LØNNSTILSKUDD}
                        onChange={() => oppdaterFilter({ tiltakstype: Tiltak.MIDLERTIDIG_LØNNSTILSKUDD })}
                    />
                    <Radio
                        role="radio"
                        label={'Varig lønnstilskudd'}
                        name={Tiltak.VARIG_LØNNSTILSKUDD}
                        checked={filter.tiltakstype === Tiltak.VARIG_LØNNSTILSKUDD}
                        onChange={() => oppdaterFilter({ tiltakstype: Tiltak.VARIG_LØNNSTILSKUDD })}
                    />
                    <Radio
                        role="radio"
                        label={'Sommerjobb'}
                        name={Tiltak.SOMMERJOBB}
                        checked={filter.tiltakstype === Tiltak.SOMMERJOBB}
                        onChange={() => oppdaterFilter({ tiltakstype: Tiltak.SOMMERJOBB })}
                    />
                </RadioGruppe>
            </EkspanderbartpanelBase>
            <PagnationValg />
        </div>
    );
};

export default Filtermeny;
