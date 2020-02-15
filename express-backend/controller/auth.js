const authService = require('../services/auth');
const auth = new authService();

class Auth {
    createUser(req, res) {
        return auth.createUser(req.body)
            .then(response => res.send(response));
    }

    loginUser(req, res) {
        return auth.loginUser(req.body)
            .then(response => res.json({ token: response }));
    }
}

module.exports = Auth;