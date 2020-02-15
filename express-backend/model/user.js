const mongoose =  require('mongoose');

const userShema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        reuired: true
    },
    email: {
        type: String,
        reuired: true
    },
    password: {
        type: String,
        reuired: true
    },
});

const User = mongoose.model('User', userShema);

module.exports = User;