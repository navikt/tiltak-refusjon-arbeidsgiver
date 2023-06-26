import { ChevronLeftIcon } from '@navikt/aksel-icons';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

const TilbakeTilOversikt: FunctionComponent = () => {
    return (
        <div style={{ padding: '1rem 0 0.75rem 0.125rem', width: '100%' }}>
            <Link
                to={{ pathname: '/refusjon', search: window.location.search }}
                style={{ display: 'flex', alignItems: 'center', color: '#0067c5' }}
            >
                <div aria-hidden={true}>
                    <ChevronLeftIcon />
                </div>
                Tilbake til oversikt
            </Link>
        </div>
    );
};

export default TilbakeTilOversikt;
