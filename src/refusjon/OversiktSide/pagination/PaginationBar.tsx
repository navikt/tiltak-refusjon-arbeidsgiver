import React, { FunctionComponent, useContext, useState } from 'react';
import { BodyShort } from '@navikt/ds-react';
import BEMHelper from '../../../utils/bem';
import { BrukerContextType } from '../../../bruker/BrukerContextType';
import { useInnloggetBruker } from '../../../bruker/BrukerContext';
import useSize from '../../../bruker/bedriftsmenyRefusjon/api/useSize';
import { PaginationContext } from './PaginationProvider';

const PaginationBar: FunctionComponent = () => {
    const [desktopview, setDesktopview] = useState<boolean>(window.innerWidth > 768);
    const brukerContext: BrukerContextType = useInnloggetBruker();
    const { valgtBedrift } = brukerContext;
    const cls = BEMHelper('pagination-bar');
    const steg: React.ReactNode[] = [];
    const pagelength = valgtBedrift?.pageData?.totalPages;
    const MAX_PAGINATION_LENGTH = desktopview ? 7 : 6;
    const START_PAGE = 0;
    const LAST_PAGE = pagelength - 1;

    useSize({ desktopview, setDesktopview });
    const { setNewPage } = useContext(PaginationContext);

    const genNyttsteg = (index: number) =>
        steg.push(
            <li
                className={cls.element('steg-knapp', valgtBedrift?.pageData?.currentPage === index ? 'aktivsteg' : '')}
                onClick={() => setNewPage(index, valgtBedrift.pageData.pagesize)}
            >
                {index + 1}
            </li>
        );

    const genererSkillelinje = () =>
        steg.push(
            <li className={cls.element('steg-skillelinje')}>
                <BodyShort size="small">...</BodyShort>
            </li>
        );

    const genererFlereSteg = (pointer: number) => {
        const teller = desktopview ? 4 : 3;
        for (let i = 0; i < teller; i++) {
            genNyttsteg(pointer + i);
        }
    };

    const lagMellomStegene = (currentPage: number) => {
        switch (true) {
            case currentPage === START_PAGE:
                return genererFlereSteg(currentPage + 1);
            case currentPage === START_PAGE + 1:
                return genererFlereSteg(currentPage);
            case currentPage === LAST_PAGE:
                return genererFlereSteg(desktopview ? currentPage - 4 : currentPage - 3);
            case currentPage === LAST_PAGE - 1:
                return genererFlereSteg(desktopview ? currentPage - 3 : currentPage - 2);
            case currentPage === LAST_PAGE - 2:
                return genererFlereSteg(desktopview ? currentPage - 2 : currentPage - 1);
            default:
                return genererFlereSteg(currentPage - 1);
        }
    };

    function generatePaginationDesktop() {
        if (pagelength >= MAX_PAGINATION_LENGTH) {
            const cp = valgtBedrift?.pageData.currentPage;

            genNyttsteg(0);
            if (cp !== START_PAGE && cp !== START_PAGE + 1 && cp !== START_PAGE + 2) {
                genererSkillelinje();
            }
            lagMellomStegene(valgtBedrift?.pageData.currentPage);
            if (cp < LAST_PAGE - 2) {
                genererSkillelinje();
            }
            genNyttsteg(LAST_PAGE);
        } else {
            for (let i = 0; i < pagelength; i++) {
                genNyttsteg(i);
            }
        }
        return steg;
    }

    function generateMobileMiniView() {
        genNyttsteg(valgtBedrift?.pageData.currentPage);
        return steg;
    }

    return window.innerWidth > 370 ? (
        <>
            {generatePaginationDesktop().map((steg, index) => {
                return <React.Fragment key={index}>{steg}</React.Fragment>;
            })}
        </>
    ) : (
        <>
            {generateMobileMiniView().map((steg, index) => {
                return <React.Fragment key={index}>{steg}</React.Fragment>;
            })}
        </>
    );
};
export default PaginationBar;
