const hasRoles = (list) => {
    return function (req, res, next) {
        // List of roles required to access

        const reqdRoles = list;

        // List of roles the user possesses
        // Receiving user roles from the jwt payload
        const acqdRoles = res.locals.user.roles;

        // Check if user roles are a subset to the list of required roles
        const result = reqdRoles.every((val) => acqdRoles.includes(val));
        console.log(result);
        if (result == false) {
            return res.send({
                status: 403,
                error: 'You are not capable of doing this,Sorry!',
            });
        }
        console.log(acqdRoles)
        next();
    };
};

module.exports = hasRoles