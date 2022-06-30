import { FunctionComponent, PropsWithChildren } from 'react';
import { Bedriftvalg, Feilstatus, StatusFeilBedriftmeny } from '../../bruker/bedriftsmenyRefusjon/api/organisasjon';
import './refusjonFeilet.less';
import BEMHelper from '../../utils/bem';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import HvitBoks from '../hvitboks/HvitBoks';
import RefusjonFeiletManglerUnderEnhet from './RefusjonFeiletManglerUnderEnhet';

interface Props {
    bedriftvalg: Bedriftvalg;
    innloggetBrukerHarAltinnTilgangerBedrifter: boolean;
}

const RefusjonFeilet: FunctionComponent<Props> = ({
    bedriftvalg,
    innloggetBrukerHarAltinnTilgangerBedrifter,
}: PropsWithChildren<Props>) => {
    const cls = BEMHelper('refusjonFeilet');

    const GenerellTilgangsInnhold: FunctionComponent = () => (
        <>
            <Normaltekst className={cls.element('tittel')}>
                For å få tilgang til refusjoner for din virksomhet må du ha en av disse Altinn-roller:
            </Normaltekst>
            <ul className={cls.element('liste')}>
                <li>ansvarlig revisor</li>
                <li>lønn og personalmedarbeider</li>
                <li>regnskapsfører lønn</li>
                <li>regnskapsfører med signeringsrettighet</li>
                <li>regnskapsfører uten signeringsrettighet</li>
                <li>revisormedarbeider</li>
                <li>norsk representant for utenlandsk enhet</li>
            </ul>
            <Normaltekst>
                Du kan også ha rettigheten <b>inntektsmelding</b>.
            </Normaltekst>
        </>
    );

    // TODO: skrive feilstatusvisning for alle statuser.
    const feilMelding = (status: StatusFeilBedriftmeny | undefined) => {
        switch (status?.status) {
            case Feilstatus.JURIDISK_MANGLER_UNDERENHET:
                return <RefusjonFeiletManglerUnderEnhet bedriftvalg={bedriftvalg} />;
            case Feilstatus.UNDERENHET_MANGLET_JURIDISK:
                return <>.....</>;

            case Feilstatus.GREIDE_IKKE_BYGGE_ORGTRE:
                return <>.....</>;
            default:
                return (
                    <HvitBoks className={cls.className}>
                        <Systemtittel className={cls.element('tittel')}>
                            Ikke tilgang til noen virksomheter i Altinn
                        </Systemtittel>
                        <GenerellTilgangsInnhold />
                    </HvitBoks>
                );
        }
    };
    return <>{bedriftvalg.feilstatus?.map((feil) => feilMelding(feil))}</>;
};
export default RefusjonFeilet;
