import React, { ReactNode } from 'react';
import Sentry from '@sentry/browser';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;

// Denne er kopiert fra: https://reactjs.org/docs/concurrent-mode-suspense.html#handling-errors
class ErrorBoundary extends React.Component<{ fallback: ReactNode }> {
    state = { hasError: false, error: null };
    static getDerivedStateFromError(error: any) {
        return {
            hasError: true,
            error,
        };
    }
    render() {
        if (this.state.hasError) {
            Sentry.captureException(error);
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
