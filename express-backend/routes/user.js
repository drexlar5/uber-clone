const UserController = require('../controller/user');
const user =  new UserController();


const routes = function routes(app){
    app.get('/users', (req, res) => user.getUsers(req, res))
}

module.exports = routes;