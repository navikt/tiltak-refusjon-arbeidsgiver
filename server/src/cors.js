export default (req, res, next) => {
    const origin = req.get('origin');
    const whitelist = [process.env.HOST, `${process.env.HOST}/refusjon`, '.nais.io', '.nav.no'];
    const isAllowedDomain = whitelist.some((domain) => origin?.endsWith(domain));
    const isLocalhost = origin?.startsWith('http://localhost:');
    if (isAllowedDomain || isLocalhost) {
        res.setHeader('Access-Control-Allow-Origin', req.get('origin'));
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-Requested-With, Authorization');
    }
    return next();
};
