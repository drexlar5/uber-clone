const userDB = require('../model/user');
const jwt = require('jsonwebtoken');
const jwtSecret =require('../config/jwtsecret')
const bcrypt = require('bcrypt');

class Auth {
    async createUser(params) {
        try {
            const { firstName, lastName, email, password } = params;
            const user = await userDB.findOne({ email });
            if (user) {
                return `this email ${email} already exist`;
            }
            const encryptedPassword = await bcrypt.hash(password, 12);
            return await userDB.create({ firstName, lastName, email, password: encryptedPassword });

        } catch (error) {
            console.log('create user error: ', error);
            return error;
        }
    }

    async  loginUser(params) {
        try {
            const { email, password } = params;
            const user = await userDB.findOne({ email });
            if (user) {
                const isPasswordCorrect = await bcrypt.compare(password, user.password);
                if (isPasswordCorrect) {
                    const token = jwt.sign(user.email, jwtSecret)
                    return token;
                }
                return `Password does not match email ${email}`;
            }
            return `this email ${email} does not exist`;
        } catch (error) {
            console.log('login user error: ', error);
            return error;
        }
    }
}

module.exports = Auth;