const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    ItemName: String,
    ItemDesc: String
})

const ItemModel = mongoose.model('ItemList', UserSchema)
module.exports = ItemModel