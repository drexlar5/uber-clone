const authController = require('../controller/auth');
const auth =  new authController();

const routes = function routes(app) {
    app.post('/signup', (req, res) => auth.createUser(req, res))

    app.post('/login', (req, res) => auth.loginUser(req, res))
}

module.exports = routes;