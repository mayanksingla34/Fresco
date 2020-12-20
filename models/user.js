var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    rollno: Number,
    username: String,
    password: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);
