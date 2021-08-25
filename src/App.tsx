import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AdvarselBannerTestversjon from './AdvarselBannerTestversjon/AdvarselBannerTestversjon';
import './App.css';
import { BrukerProvider } from './bruker/BrukerContext';
import ErrorOgSuspenseHandler from './ErrorOgSuspenseHandler';
import ScrollToTop from './komponenter/ScrollToTop';
import Landingsside from './Landingsside';
import OversiktSide from './refusjon/OversiktSide/OversiktSide';
import Refusjon from './refusjon/RefusjonSide/Refusjon';
import { registrereBesok } from './utils/amplitude-utils';
import { XMLHttpReqHandler } from './services/XMLHttpRequestHandler';

function App() {
    const [xmlHttpReq, setXmlHttpReq] = useState<boolean>(false);
    useEffect(() => {
        XMLHttpReqHandler(xmlHttpReq, setXmlHttpReq);
        registrereBesok();
    }, [xmlHttpReq]);
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AdvarselBannerTestversjon />
            <Switch>
                <Route exact path="/">
                    <Landingsside />
                </Route>
                <BrukerProvider>
                    <div style={{ minHeight: '10rem', padding: '0.5rem' }}>
                        <Route exact path="/refusjon">
                            <ErrorOgSuspenseHandler>
                                <OversiktSide />
                            </ErrorOgSuspenseHandler>
                        </Route>
                        <Route path="/refusjon/:refusjonId">
                            <ErrorOgSuspenseHandler>
                                <Refusjon />
                            </ErrorOgSuspenseHandler>
                        </Route>
                    </div>
                </BrukerProvider>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
