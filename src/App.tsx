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
}

function App() {
    useEffect(() => {
        registrereBesok();
    });

    const RedirectWithStatus = (props: Props) => {
        const { from, to, status } = props;
        console.log('header status code ', status);

        return (
            <Route
                render={() => {
                    console.log('rendering redirect route. status header: ', status);
                    if (status === 301) {
                        return <Redirect from={from} to={to} />;
                    }
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
                    <>
                        <RedirectWithStatus from="/refusjon" to="/login" status={301} />
                        <RedirectWithStatus from="/refusjon" to="/login" status={302} />
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
                    </>
                </BrukerProvider>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
