export default (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-Requested-With');
    res.setHeader('Access-Control-Expose-Headers', '');
    res.setHeader('preflightContinue', false);
    return next();
};
