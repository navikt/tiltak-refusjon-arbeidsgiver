import React, { FunctionComponent, PropsWithChildren } from 'react';
import HvitBoks from '../hvitboks/HvitBoks';
import { Normaltekst, Systemtittel, Undertittel, Element } from 'nav-frontend-typografi';
import VerticalSpacer from '../VerticalSpacer';
import { Feilstatus } from '../../bruker/bedriftsmenyRefusjon/api/organisasjon';
import { InnloggetBruker } from '../../bruker/BrukerContextType';
import BEMHelper from '../../utils/bem';
import './manglerRettigheter.less';

interface Props {
    feilstatus: Feilstatus | undefined;
    innloggetBruker: InnloggetBruker | undefined;
}

const ManglerRettigheter: FunctionComponent<Props> = ({ feilstatus, innloggetBruker }: PropsWithChildren<Props>) => {
    const cls = BEMHelper('manglerRettigheter');

    const mapfeilstatuserTilMelding = (status: Feilstatus) => {
        switch (status) {
            case Feilstatus.JURIDISK_MANGLER_UNDERENHET:
                return (
                    <HvitBoks
                        className={cls.className}
                        style={{ boxShadow: 'box-shadow: rgb(0 0 0 / 10%) 0 4px 12px' }}
                    >
                        <Undertittel>
                            Du har tilganger til en eller flere bedrifter, men kun på juridisk nivå.
                        </Undertittel>
                        <VerticalSpacer rem={1} />
                        {innloggetBruker?.organisasjoner?.map((org) => (
                            <>
                                <Element className={cls.element('rad')}>Bedriftnavn:</Element> {org.Name}
                                <Element className={cls.element('rad')}>Type bedrift:</Element>{' '}
                                {org.Type === 'Enterprise' ? 'Juridisk overenhet' : 'Underenhet'}
                                <Element className={cls.element('rad')}>Organisasjonsnummer:</Element>{' '}
                                {org.OrganizationNumber}
                                <Element className={cls.element('rad')}>Juridisk overenhet:</Element>{' '}
                                {org.ParentOrganizationNumber ?? ''}
                            </>
                        ))}
                    </HvitBoks>
                );

            default:
                return <Undertittel>"Ukjent feil har oppstått"</Undertittel>;
        }
    };

    switch (feilstatus) {
        case Feilstatus.JURIDISK_MANGLER_UNDERENHET:
            return (
                <HvitBoks style={{ margin: '1rem auto 2rem auto' }}>
                    <VerticalSpacer rem={2} />
                    {mapfeilstatuserTilMelding(feilstatus)}
                    <VerticalSpacer rem={2} />
                </HvitBoks>
            );
        default:
            return (
                <HvitBoks style={{ margin: '1rem auto 2rem auto' }}>
                    <Systemtittel>Ikke tilgang til noen virksomheter i Altinn</Systemtittel>
                    <VerticalSpacer rem={2} />
                    <Normaltekst>
                        For å få tilgang til refusjoner for din virksomhet må du ha en av disse Altinn-rollene:
                    </Normaltekst>
                    <VerticalSpacer rem={1} />
                    <ul>
                        <li>ansvarlig revisor</li>
                        <li>lønn og personalmedarbeider</li>
                        <li>regnskapsfører lønn</li>
                        <li>regnskapsfører med signeringsrettighet</li>
                        <li>regnskapsfører uten signeringsrettighet</li>
                        <li>revisormedarbeider</li>
                        <li>norsk representant for utenlandsk enhet</li>
                    </ul>
                    <VerticalSpacer rem={1} />
                    <Normaltekst>
                        Du kan også ha rettigheten <b>inntektsmelding</b>.
                    </Normaltekst>
                </HvitBoks>
            );
    }
};
export default ManglerRettigheter;
