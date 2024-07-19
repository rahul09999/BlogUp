//Middleware to check for token in each request and call next()

const { validateToken } = require("../service/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req, res, next)=> {
        const tokenCookieValue = req.cookies[cookieName] //req.cookies is syntax of cookieParser to get cookie values from request
        if(!tokenCookieValue){
           return next(); //IMP- must add return with next otherwise it execute rest of the code and send multiple request
        } 

        try {
            const payload = validateToken(tokenCookieValue);
            req.user = payload
            // console.log("payload added to req.user using auth middleware ", payload);
        } catch (err) {
            
        }
        next(); //call next middleware when all things done
    }
}

module.exports = {
    checkForAuthenticationCookie,
}