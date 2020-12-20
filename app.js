var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var cron = require("node-cron");

var transport = require("./models/transport");
var cos = require("./models/cos");
var category = require("./models/category");
var item = require("./models/item");
var user = require("./models/user");
var order = require("./models/order");
var message = require("./models/message");
const { session } = require("passport");

// mongoose.connect("mongodb://localhost:27017/fresco", {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false});
mongoose.connect("mongodb+srv://mayanksingla34:passwd@cluster0.pfh9t.mongodb.net/fresco?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))
app.set("view engine", "ejs");
app.use(flash());

app.use(require("express-session")({
    secret: "mayank",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.get("/", function(req,res){
    res.render("home");
});

app.get("/map", function(req,res){
    res.render("map");
});

app.get("/cos", function(req,res){
    cos.find({}, function(err, outlets){
        if(err){
            console.log(err);
        } else {
            res.render("cos", {outlets: outlets});
        }
    });
});

app.get("/transport", function(req,res){
    transport.find({}, function(err, drivers){
        if(err){
            console.log(err);
        } else {
            res.render("transport", {drivers: drivers});
        }
    });    
});

app.get("/accept", isLoggedIn ,function(req,res){
    category.find().populate("items").exec(function(err, categories){
        if(err){
            console.log(err);
        } else {
            res.render("accept", {categories: categories});
        }
    });
});

app.get("/accept/:id", isLoggedIn ,function(req,res){
    item.findById(req.params.id, function(err, founditem){
        if(err){
            console.log(err);
            return res.redirect("/noexist");
        } else{
            if((founditem.stock-founditem.book)<=0){
                req.flash("error", "Stock not available");
                return res.redirect("/accept");
            }
            var bok = founditem.book+1;
            var d = new Date();
            // d.setDate(d.getDate() - 3);
            var e = new Date();
            e.setDate(d.getDate() + 3);
            item.findByIdAndUpdate(req.params.id, {book: bok}, function(err, updateditem){
                if(err){
                    console.log(err);
                } else {
                    order.create({
                        id: "A-" + req.user.rollno + "-" + d.getFullYear() +  d.getMonth() + d.getDate() + "-" + d.getHours() + d.getMinutes() + d.getSeconds(),
                        name: updateditem.name,
                        itemid: updateditem.id,
                        type: "Accept",
                        status: "Active",
                        date: d.toLocaleDateString(),
                        expdate: e.toLocaleDateString()
                    }, function(err, neworder){
                        if(err){
                            console.log(err);
                        } else {
                        req.user.orders.push(neworder);
                        req.user.save();
                        neworder.user.push(req.user);
                        neworder.save({}, function(err, data){
                            if(err){
                                console.log(err);
                            } else {
                                res.redirect("/orders");
                            }
                        });
                        }
                    });
                }
            });
        }
    });
});

app.get("/donate", isLoggedIn , function(req,res){
    category.find().populate("items").exec(function(err, categories){
        if(err){
            console.log(err);
        } else {
            res.render("donate", {categories: categories});
        }
    });
});

app.get("/donate/:id", isLoggedIn ,function(req,res){
    item.findById(req.params.id, function(err, founditem){
        if(err){
            console.log(err);
            return res.redirect("/noexist");
        } else{
            var dnt = founditem.donate+1;
            var d = new Date();
            // d.setDate(d.getDate() - 3);
            var e = new Date();
            e.setDate(d.getDate() + 3);
            item.findByIdAndUpdate(req.params.id, {donate: dnt}, function(err, updateditem){
                if(err){
                    console.log(err);
                } else {
                    order.create({
                        id: "D-" + req.user.rollno + "-" + d.getFullYear() +  d.getMonth() + d.getDate() + "-" + d.getHours() + d.getMinutes() + d.getSeconds(),
                        name: updateditem.name,
                        itemid: updateditem.id,
                        type: "Donate",
                        status: "Active",
                        date: d.toLocaleDateString(),
                        expdate: e.toLocaleDateString()
                    }, function(err, neworder){
                        if(err){
                            console.log(err);
                        } else {
                        req.user.orders.push(neworder);
                        req.user.save();
                        neworder.user.push(req.user);
                        neworder.save({}, function(err, data){
                            if(err){
                                console.log(err);
                            } else {
                                res.redirect("/orders");
                            }
                        });
                        }
                    });
                }
            });
        }
    });
});

app.get("/orders", isLoggedIn ,function(req,res){
    user.findById(req.user._id).populate("orders").exec(function(err, founduser){
        if(err){
            console.log(err);
        } else {
            res.render("orders", {founduser: founduser});
        }
    });
});

app.get("/cancelorder/:id", isLoggedIn ,function(req,res){
    order.findByIdAndUpdate(req.params.id, {status: "Cancelled"}, function(err, updatedorder){
        if(err){
            console.log(err);
            return res.redirect("/noexist");
        } else{
            var bok = 0;
            var dnt = 0;
            item.findById(updatedorder.itemid, function(err,founditem){
                if(err){
                    console.log(err);
                }else{
                    bok = founditem.book;
                    dnt = founditem.donate;
                    var type = updatedorder.type;
                    if(type == "Accept"){
                        bok = bok-1;
                        item.findByIdAndUpdate(updatedorder.itemid, {book: bok}, function(err, updateditem){
                            if(err){
                                console.log(err);
                            }else{
                                res.redirect("/orders");
                            }
                        });
                    }
                    if(type == "Donate"){
                        dnt = dnt-1;
                        item.findByIdAndUpdate(updatedorder.itemid, {donate: dnt}, function(err, updateditem){
                            if(err){
                                console.log(err);
                            }else{
                                res.redirect("/orders");
                            }
                        });
                    }
                }
            });
        }
    });
});

app.get("/admin", function(req,res){
    res.render("admin");
});

app.get("/adminlogin", function(req,res){
    res.render("adminlogin");
});

app.post("/adminlogin", passport.authenticate("local",
    {
        successRedirect: "/admin",
        failureRedirect: "/adminlogin",
        failureFlash: true
    }) ,function(req,res){
});

app.get("/adminlogout", isAdmin , function(req,res){
    req.logout();
    res.redirect("/admin");
});

app.get("/adminorders", isAdmin ,function(req,res){
    order.find().populate("user").populate("item").exec(function(err, orders){
        if(err){
            console.log(err);
        } else {
            res.render("adminorders", {orders: orders});
        }
    });
});

app.get("/adminsubmit/:id", isAdmin ,function(req,res){
    order.findByIdAndUpdate(req.params.id, {status: "Success"}, function(err, updatedorder){
        if(err){
            console.log(err);
            return res.redirect("/noexist");
        } else{
            var bok = 0;
            var dnt = 0;
            var stk = 0;
            item.findById(updatedorder.itemid, function(err,founditem){
                if(err){
                    console.log(err);
                }else{
                    bok = founditem.book;
                    dnt = founditem.donate;
                    stk = founditem.stock;
                    var type = updatedorder.type;
                    if(type == "Accept"){
                        bok = bok-1;
                        stk = stk-1;
                    }
                    if(type == "Donate"){
                        dnt = dnt-1;
                        stk = stk+1;
                    }
                    item.findByIdAndUpdate(updatedorder.itemid, {book: bok, donate: dnt, stock: stk}, function(err, updateditem){
                        if(err){
                            console.log(err);
                        } else {
                            res.redirect("/adminorders");
                        }
                    });
                }
            });
        }
    });
});

app.get("/adminitems", isAdmin ,function(req,res){
    category.find().populate("items").exec(function(err, categories){
        if(err){
            console.log(err);
        } else {
            res.render("adminitems", {categories: categories});
        }
    });
});

app.get("/adminmessages", isAdmin ,function(req,res){
    message.find({},function(err,messages){
        if(err){
            console.log(err);
        } else{
            res.render("adminmessages", {messages: messages});
        }
    });
});

app.get("/adminpasswd", isAdmin ,function(req,res){
    res.render("adminpasswd");
});

app.post("/adminpasswd", isAdmin ,function(req,res){
    req.user.changePassword(req.body.oldpassword, req.body.newpassword, function(err, password){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/profile");
        } else {
        req.flash("success", "Password Updated");
        res.redirect("/adminlogin");
        }
    });
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }) ,function(req,res){
});


app.get("/logout", isLoggedIn , function(req,res){
    req.logout();
    res.redirect("/");
});

app.get("/signup", function(req,res){
    res.render("signup");
});

app.post("/signup", function(req,res){
    if(!req.body.name){
        req.flash("error", "Name not given");
        return res.redirect("/signup");
    }
    if(!req.body.rollno){
        req.flash("error", "Roll Number not given");
        return res.redirect("/signup");
    }
    var newUser = new user({name: req.body.name, rollno: req.body.rollno, username: req.body.username});
    user.register(newUser, req.body.password, function(err, newuser){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/signup");
        } else {
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
        }
    });
});

app.get("/profile", isLoggedIn ,function(req,res){
    res.render("profile");
});

app.post("/profileupdate", isLoggedIn ,function(req,res){
    if(!req.body.name){
        req.flash("error", "Name not given");
        return res.redirect("/profile");
    }
    if(!req.body.rollno){
        req.flash("error", "Roll Number not given");
        return res.redirect("/profile");
    }
    if(!req.body.username){
        req.flash("error", "Username not given");
        return res.redirect("/profile");
    }
    if(!req.body.password){
        req.flash("error", "Password not given");
        return res.redirect("/profile");
    }
    req.user.changePassword(req.body.password, req.body.password, function(err, password){
        if(err){
            console.log(err);
            req.flash("error", "Password is incorrect");
            return res.redirect("/profile");
        }
        else{
            user.findByIdAndUpdate(req.user._id, {name: req.body.name, rollno: req.body.rollno, username: req.body.username}, function(err, founduser){
                if(err){
                    console.log(err);
                    req.flash("error", err.message);
                } else {
                passport.authenticate("local")(req, res, function(){
                    req.flash("success", "Data Updated");
                    res.redirect("/profile");
                });
                }
            });
        }
    });
});

app.post("/updatepassword", isLoggedIn ,function(req,res){
    req.user.changePassword(req.body.oldpassword, req.body.newpassword, function(err, password){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/profile");
        } else {
        //passport.authenticate("local")(req, res, function(){
        req.logout();
        req.flash("success", "Password Updated");
        res.redirect("/login");
        //});
        }
    });
});

app.get("/contactus", function(req,res){
    res.render("contactus");
});

app.post("/contactus", function(req,res){
    if(!req.body.name){
        req.flash("error", "Name not given");
        return res.redirect("/contactus");
    }
    if(!req.body.email){
        req.flash("error", "E-mail not given");
        return res.redirect("/contactus");
    }
    if(!req.body.message){
        req.flash("error", "Message not given");
        return res.redirect("/contactus");
    }
    // console.log(req.body.name);
    // console.log(req.body.email);
    // console.log(req.body.message);
    message.create({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    },function(err, message){
        if(err){
            console.log(err);
        } else{
        req.flash("success", "Message Sent");
        res.redirect("/contactus");
        }
    });
});

app.get("*", function(req,res){
    res.render("noexist");
});

cron.schedule("0 1 0 * * *",function(){
    var d = new Date();
    today = d.toLocaleDateString();
    order.find({expdate: today},function(err, foundorders){
        if(err){
            console.log(err);
        } else{
            foundorders.forEach(function(x){
                order.findByIdAndUpdate(x._id, {status: "Expired"}, function(err, updatedorder){
                    if(err){
                        console.log(err);
                        return res.redirect("/noexist");
                    } else{
                        var bok = 0;
                        var dnt = 0;
                        item.findById(updatedorder.itemid, function(err,founditem){
                            if(err){
                                console.log(err);
                            }else{
                                bok = founditem.book;
                                dnt = founditem.donate;
                                var type = updatedorder.type;
                                if(type == "Accept"){
                                    bok = bok-1;
                                    item.findByIdAndUpdate(updatedorder.itemid, {book: bok}, function(err, updateditem){
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                }
                                if(type == "Donate"){
                                    dnt = dnt-1;
                                    item.findByIdAndUpdate(updatedorder.itemid, {donate: dnt}, function(err, updateditem){
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Log in First");
    res.redirect("/login");
}

function isAdmin(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.username == "admin"){
            return next();
        }
    }
    req.flash("error", "Please log in as Admin");
    res.redirect("/adminlogin");
}

app.listen(process.env.PORT);