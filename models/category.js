var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
    name: String,
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "item"
        }
    ]
});

module.exports = mongoose.model("category", categorySchema);