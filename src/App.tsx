import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import React, { FunctionComponent, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AdvarselBannerTestversjon from './AdvarselBannerTestversjon/AdvarselBannerTestversjon';
import './App.css';
import { BrukerProvider } from './bruker/BrukerContext';
import ErrorOgSuspenseHandler from './ErrorOgSuspenseHandler';
import ScrollToTop from './komponenter/ScrollToTop';
import Landingsside from './Landingsside';
import OversiktSide from './refusjon/OversiktSide/OversiktSide';
import Refusjon from './refusjon/RefusjonSide/Refusjon';
import { registrereBesok } from './utils/amplitude-utils';

interface Props {
    from: string;
    to: string;
    status: number;
    children: React.ReactNode;
}

function App() {
    useEffect(() => {
        registrereBesok();
    });

    const RedirectWithStatus: FunctionComponent<Props> = (props: Props) => {
        const { from, to, status, children } = props;
        return (
            <Route
                render={({ staticContext }) => {
                    if (staticContext) staticContext.statusCode = status;
                    return (
                        <Redirect from={from} to={to}>
                            {children}
                        </Redirect>
                    );
                }}
            />
        );
    };

    return (
        <BrowserRouter>
            <ScrollToTop />
            <AdvarselBannerTestversjon />
            <Switch>
                <Route exact path="/">
                    <Landingsside />
                </Route>
                <BrukerProvider>
                    <RedirectWithStatus from="/refusjon" to="/login" status={301}>
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
                    </RedirectWithStatus>
                </BrukerProvider>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
