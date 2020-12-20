var mongoose = require("mongoose");

var cosSchema = new mongoose.Schema({
    name: String,
    image: String,
    contact: Number,
    timming: String,
    address: String
});

module.exports = mongoose.model("cos", cosSchema);