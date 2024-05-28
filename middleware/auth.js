const jwt = require("jsonwebtoken");
const checkAuth = (req, res, next)=>{
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")){
        return res.status(401).send({message: "Необходима авторизации" });
    }
    const token = authorization.replace("Bearer ", "");
    try{
        req.user = verify(token, "some-secret-key");
        next()
    }catch(err){
        res.status(401).send({message: "Необходима авторизация"})
    }
};
const checkCookiesJWT = (req, res, next)=>{
    if (!req.cookies.jwt){
        return res.redirect("/")
    }
    req.headers.authorization = `Bearer ${req.cookies.jwt}`
    next()
}
module.exports = {checkAuth, checkCookiesJWT}