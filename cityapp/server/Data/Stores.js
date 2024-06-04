const mongoose = require('mongoose')
const { CoordinateSchema } = require('./Coordinate.js')

const StoreSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    place_type: {
        type: String,
        require: false
    },
    phone: {
        type: String,
        require: false
    },
    name: {
        type: String,
        require: true,
        unique: true
    },
    url: {
        type: String,
        require: false
    },
    district: {
        type: String,
        require: false
    },
    rating: {
        type: Number,
        require: false
    },
    image_url: {
        type: String,
        require: false
    },
    coordinate: {
        type: CoordinateSchema,
        require: false
    },
    address: {
        type: String,
        require: false
    }
})

const Store = new mongoose.model("Store", StoreSchema)

module.exports = {
    StoreSchema,
    Store
}