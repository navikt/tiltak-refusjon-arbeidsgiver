import React, { ReactNode } from 'react';
import { sendSentryException } from './index';

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
            sendSentryException(this.state.error);
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
