var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
    name: String,
    id: String,
    itemid: String,
    type: String,
    status: String,
    date: String,
    expdate: String,
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
});

module.exports = mongoose.model("order", orderSchema);