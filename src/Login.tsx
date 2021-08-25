import { FunctionComponent, useEffect } from 'react';
import { kontaktLogin } from './services/rest-service';

const Login: FunctionComponent = () => {
    useEffect(() => {
        kontaktLogin();
    });
    return null;
};
export default Login;
