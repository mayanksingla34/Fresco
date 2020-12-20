var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
    name: String,
    stock: Number,
    donate: Number,
    book: Number
});

module.exports = mongoose.model("item", itemSchema);