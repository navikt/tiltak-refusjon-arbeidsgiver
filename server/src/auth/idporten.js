import { createRemoteJWKSet, jwtVerify } from 'jose';
import config from '../config';

const jwkSet = createRemoteJWKSet(new URL(config.idporten().jwksUri));

// Tokens levert av Wonderwall må alltid verifiseres
const verifyAuthorization = async (req) => {
    try {
        const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
        if (!authToken) {
            return undefined;
        }
        const result = await jwtVerify(authToken, jwkSet);
        return result;
    } catch (error) {
        return undefined;
    }
};

export default { verifyAuthorization };
