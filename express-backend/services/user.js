const userDB = require('../model/user');

class User {
    async getUsers() {
        return await userDB.aggregate([
            {
                $match: {'__v': 0}
            },
            {
                $project: { _id: 0, firstName: 1, lastName: 1, email: 1}
            }
        ]);
    }

}

module.exports = User;