const jwt = require("jsonwebtoken");

const JwtConfig = {
    createToken(payload, exp = "1y") {
        return jwt.sign(payload, "alan", {
            expiresIn: exp,
        });
    },
    verifyToken(token) {
        return jwt.verify(token, "alan");
    },
};

module.exports = JwtConfig;
