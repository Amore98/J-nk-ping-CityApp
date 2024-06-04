const mongoose = require('mongoose')

const CoordinateSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        require: true
    },
    longitude: {
        type: Number,
        require: true
    }
})

module.exports = {
    CoordinateSchema
}