import React, { ReactNode } from 'react';

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
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
