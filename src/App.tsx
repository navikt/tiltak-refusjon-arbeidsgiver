import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdvarselBannerTestversjon from './AdvarselBannerTestversjon/AdvarselBannerTestversjon';
import './App.less';
import { BrukerProvider } from './bruker/BrukerContext';
import ErrorOgSuspenseHandler from './ErrorOgSuspenseHandler';
import ScrollToTop from './komponenter/ScrollToTop';
import Landingsside from './Landingsside';
import OversiktSide from './refusjon/OversiktSide/OversiktSide';
import Refusjon from './refusjon/RefusjonSide/Refusjon';
import { registrereBesok } from './utils/amplitude-utils';

function App() {
    useEffect(() => {
        registrereBesok();
    });
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AdvarselBannerTestversjon />
            <Routes>
                <Route path="/" element={<Landingsside />}>
                    {/* <Landingsside /> */}
                </Route>
            </Routes>

            <BrukerProvider>
                <div style={{ minHeight: '10rem', padding: '0.5rem' }}>
                    <Routes>
                        <Route
                            path="/refusjon"
                            element={
                                <ErrorOgSuspenseHandler>
                                    <OversiktSide />
                                </ErrorOgSuspenseHandler>
                            }
                        ></Route>
                        <Route path="/refusjon/:refusjonId/*" element={
                            <ErrorOgSuspenseHandler>
                                <Refusjon />
                            </ErrorOgSuspenseHandler>

                        }>
                        </Route>
                    </Routes>
                </div>
            </BrukerProvider>
        </BrowserRouter>
    );
}

export default App;
