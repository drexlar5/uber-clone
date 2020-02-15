const UserService = require('../services/user');
const user = new UserService();

class User {
    getUsers(req, res) {
        return user.getUsers()
            .then(resp => res.send(resp));
    }


}

module.exports = User;