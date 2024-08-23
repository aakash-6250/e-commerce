const userMiddleware = (req, res, next) => {
    res.locals.user = req.user || "";
    res.locals.title = "Geldix Pharmaceuticals : Best Online Pharmacy in India";
    res.locals.description = "Geldix Pharmaceuticals is a leading online pharmaceuticals and medical store in India. We provide a wide range of medicines and healthcare products at affordable prices.";
    next();
};

module.exports = userMiddleware;