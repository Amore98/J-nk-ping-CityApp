const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    hashed_password: {
        type: String,
        require: true
    }
})

const User = new mongoose.model("User", UserSchema)

module.exports = {
    UserSchema,
    User
}