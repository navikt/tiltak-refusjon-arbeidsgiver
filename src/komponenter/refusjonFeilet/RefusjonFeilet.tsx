import { FunctionComponent, PropsWithChildren } from 'react';
import { Bedriftvalg, Feilstatus, StatusFeilBedriftmeny } from '../../bruker/bedriftsmenyRefusjon/api/api';
import BEMHelper from '../../utils/bem';
import './refusjonFeilet.less';
import RefusjonFeiletManglerUnderEnhet from './RefusjonFeiletManglerUnderEnhet';
import { BodyShort, Heading } from '@navikt/ds-react';
import Boks from '../Boks/Boks';

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
            <BodyShort size="small" className={cls.element('tittel')}>
                For å få tilgang til refusjoner for din virksomhet må du ha en av disse Altinn-roller:
            </BodyShort>
            <ul className={cls.element('liste')}>
                <li>ansvarlig revisor</li>
                <li>lønn og personalmedarbeider</li>
                <li>regnskapsfører lønn</li>
                <li>regnskapsfører med signeringsrettighet</li>
                <li>regnskapsfører uten signeringsrettighet</li>
                <li>revisormedarbeider</li>
                <li>norsk representant for utenlandsk enhet</li>
            </ul>
            <BodyShort size="small">
                Du kan også ha rettigheten <b>inntektsmelding</b>.
            </BodyShort>
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
                    <Boks variant="hvit" className={cls.className}>
                        <Heading size="medium" className={cls.element('tittel')}>
                            Ikke tilgang til noen virksomheter i Altinn
                        </Heading>
                        <GenerellTilgangsInnhold />
                    </Boks>
                );
        }
    };

    if (innloggetBrukerHarAltinnTilgangerBedrifter) {
        return (
            <Boks variant="hvit" className={cls.className}>
                <Heading size="medium" className={cls.element('tittel')}>
                    Ikke tilgang til noen virksomheter i Altinn
                </Heading>
                <GenerellTilgangsInnhold />
            </Boks>
        );
    }

    return <>{bedriftvalg.feilstatus?.map((feil) => feilMelding(feil))}</>;
};
export default RefusjonFeilet;
