var mongoose = require("mongoose");

var transportSchema = new mongoose.Schema({
    name: String,
    image: String,
    contact: Number,
    cart: Number,
    language: String
});

module.exports = mongoose.model("transport", transportSchema);