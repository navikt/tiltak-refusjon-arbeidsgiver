import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import React, { FunctionComponent, useEffect } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
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

interface RedirectUrl {
    to: string;
}

enum httpStatus {
    HTTP_REDIRECT = 301,
    HTTP_FOUND_REDIRECT = 302,
}

function App() {
    useEffect(() => {
        registrereBesok();
        console.log('registrerer besøk på siden.');
    });

    const RedirectLoginService: FunctionComponent<RedirectUrl> = (props: RedirectUrl) => {
        const history = useHistory();
        useEffect(() => {
            history.push(props.to);
        });
        return null;
    };

    const RedirectWithStatus: FunctionComponent<Props> = (props: Props) => {
        const { status, to } = props;
        console.log('header status code ', status);

        return (
            <Route
                render={() => {
                    console.log('rendering redirect route. status header: ', status);
                    if (status === httpStatus.HTTP_REDIRECT || status === httpStatus.HTTP_FOUND_REDIRECT) {
                        return <RedirectLoginService to={to} />;
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
                <RedirectWithStatus from="/refusjon" to="/login" status={301} />
                <RedirectWithStatus from="/refusjon" to="/login" status={302} />
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
