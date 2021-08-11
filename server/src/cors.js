export default (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.get('origin'));
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-Requested-With, Authorization');
    return next();
};
