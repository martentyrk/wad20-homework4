const UserModel = require("../models/UserModel");
const jwt = require("../library/jwt");

module.exports = (request, response, next) => {
    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    // Get authorization from headers
    const auth = request.headers.authorization;
    if (auth) {
        // Auth is in Bearer token format so split that
        const token = auth.split(" ")[1];

        // Decode jwt to get user id
        const user = jwt.verifyAccessToken(token);

        // Get user by id
        UserModel.getById(user.id, (user) => {
            request.currentUser = user;
            next();
        });
    } else {
        // if there is no authorization header

        return response.status(403).json({
            message: "Invalid token",
        });
    }
};
