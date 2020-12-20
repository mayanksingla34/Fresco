var mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/fresco", {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false});
mongoose.connect("mongodb+srv://mayanksingla34:passwd@cluster0.pfh9t.mongodb.net/fresco?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false});

console.log("mongo connected");

var transport = require("./models/transport");
var cos = require("./models/cos");
var category = require("./models/category");
var item = require("./models/item");
var user = require("./models/user");
var order = require("./models/order");
var message = require("./models/message");
const { findByIdAndUpdate } = require("./models/transport");

// /*------------------Transport---------------*/

// var i=0;
// for(i=1;i<=6;i++)
// {
//     transport.create({
//         name: "Driver " + i,
//         image: "images/driver.jpg",
//         cart: i,
//         contact: 999999990 + i,
//         language: "Punjabi"
//      }, function(err, driver){
//          if(err){
//              console.log(err);
//          } else {
//              console.log(driver);
//          }
//      });
// }


//  transport.find({}, function(err, drivers){
//      if(err){
//          console.log("OH NO, ERROR!");
//          console.log(err);
//      } else {
//          console.log("ALL THE DRIVERS.....");
//          console.log(drivers);
//      }
//  });

// /*------------------COS-------------------------*/

// var i=0;
// for(i=1;i<=6;i++)
// {
//     cos.create({
//         name: "Shop " + i,
//         image: "images/cos.jpg",
//         contact: 999999990 + i,
//         timming: "9:00 A.M. to 5:00 P.M.",
//         address: "COS, TIET Patiala"
//      }, function(err, outlet){
//          if(err){
//              console.log(err);
//          } else {
//              console.log(outlet);
//          }
//      });
// }

//  cos.find({}, function(err, outlets){
//      if(err){
//          console.log("OH NO, ERROR!");
//          console.log(err);
//      } else {
//          console.log("ALL THE OUTLETS.....");
//          console.log(outlets);
//      }
//  });

// /*------------------Category-------------------------*/

// var addcategory = ["Sports Items","LAB Equipment", "Stationary Item", "Electronics", "Daily Use"];
// var x;

// for (x of addcategory) {
//     category.create({
//         name:x
//         }, function(err, categories){
//             if(err){
//                 console.log(err);
//             } else {
//                 console.log(categories);
//             }
//         });
// }

//  category.find({}, function(err, categories){
//      if(err){
//          console.log("OH NO, ERROR!");
//          console.log(err);
//      } else {
//          console.log("ALL THE CATEGORIES.....");
//          console.log(categories);
//      }
//  });

/*------------------Items-------------------------*/

/*--------Sports---------*/

// var addsports = [
// "Tracksuit",
// "Thapar Sports Kit",
// "Sports shoes",
// "Cricket Kit",
// "Cricket bat",
// "Basket Ball",
// "Volley Ball",
// "Badminton Racket",
// "Badminton Shoes",
// "Lawn Tennis Racket",
// "Table Tennis Racket",
// "FootBall",
// "Yoga Mat"
// ];

// var x;

// for (x of addsports) {
//     item.create({
//         name:x,
//         stock: 10,
//         donate: 0,
//         book: 0
//         }, function(err, newitem){
//             if(err){
//                 console.log(err);
//             } else {
//                  category.findOne({name: "Sports Items"}, function(err, sports){
//                     if(err){
//                         console.log(err);
//                     } else {
//                         sports.items.push(newitem);
//                         sports.save({}, function(err, data){
//                             if(err){
//                                 console.log(err);
//                             } else {
//                                 console.log(data);
//                             }
//                         });
//                     }
//                 });
//             }
//         });
// }

// /*--------LAB---------*/

// var addlab = [
// "Chemistry LAB Coat",
// "Mechanical LAB Coat",
// "Workshop Shoes"
// ];

// var x;

// for (x of addlab) {
//     item.create({
//         name:x,
//         stock: 10,
//         donate: 0,
//         book: 0
//         }, function(err, newitem){
//             if(err){
//                 console.log(err);
//             } else {
//                  category.findOne({name: "LAB Equipment"}, function(err, lab){
//                     if(err){
//                         console.log(err);
//                     } else {
//                         lab.items.push(newitem);
//                         lab.save({}, function(err, data){
//                             if(err){
//                                 console.log(err);
//                             } else {
//                                 console.log(data);
//                             }
//                         });
//                     }
//                 });
//             }
//         });
// }


// /*--------Stationary---------*/

// var addstationary = [
// "Drafter",
// "Lab Manual",
// "Books",
// "Geometery Kit",
// "Scientific Calculator",
// "Mechanical Receipt Book",
// "ED Drawing Sheets",
// "Drawing Pencil Set",
// "Register",
// "Paint Brush",
// "Tape Dispenser"
// ];

// var x;

// for (x of addstationary) {
//     item.create({
//         name:x,
//         stock: 10,
//         donate: 0,
//         book: 0
//         }, function(err, newitem){
//             if(err){
//                 console.log(err);
//             } else {
//                  category.findOne({name: "Stationary Item"}, function(err, stat){
//                     if(err){
//                         console.log(err);
//                     } else {
//                         stat.items.push(newitem);
//                         stat.save({}, function(err, data){
//                             if(err){
//                                 console.log(err);
//                             } else {
//                                 console.log(data);
//                             }
//                         });
//                     }
//                 });
//             }
//         });
// }

// /*--------Electronics---------*/

// var addelec = [
// "Arduino Kit",
// "Kettle",
// "Extension",
// "Fairy Lights",
// "Table Lamp",
// "Night Lamp",
// "Multi Plug"
// ];

// var x;

// for (x of addelec) {
//     item.create({
//         name:x,
//         stock: 10,
//         donate: 0,
//         book: 0
//         }, function(err, newitem){
//             if(err){
//                 console.log(err);
//             } else {
//                  category.findOne({name: "Electronics"}, function(err, elec){
//                     if(err){
//                         console.log(err);
//                     } else {
//                         elec.items.push(newitem);
//                         elec.save({}, function(err, data){
//                             if(err){
//                                 console.log(err);
//                             } else {
//                                 console.log(data);
//                             }
//                         });
//                     }
//                 });
//             }
//         });
// }

// /*--------Daily Use---------*/

// var adddaily = [
// "Cycle",
// "Mattress",
// "Almirah",
// "Chess",
// "Cards",
// "Snakes and ladders",
// "Ludo",
// "Heat bag",
// "Bucket mug",
// "Wall Clock",
// "Alarm Clock",
// "Pen Stand",
// "Wall Hook Hanger",
// "Bag"
// ];

// var x;

// for (x of adddaily) {
//     item.create({
//         name:x,
//         stock: 10,
//         donate: 0,
//         book: 0
//         }, function(err, newitem){
//             if(err){
//                 console.log(err);
//             } else {
//                  category.findOne({name: "Daily Use"}, function(err, daily){
//                     if(err){
//                         console.log(err);
//                     } else {
//                         daily.items.push(newitem);
//                         daily.save({}, function(err, data){
//                             if(err){
//                                 console.log(err);
//                             } else {
//                                 console.log(data);
//                             }
//                         });
//                     }
//                 });
//             }
//         });
// }

// /*--------Find Items---------*/

// item.find({}, function(err, items){
//     if(err){
//         console.log("OH NO, ERROR!");
//         console.log(err);
//     } else {
//         console.log("ALL THE ITEMS.....");
//         console.log(items);
//     }
// });

// category.findOne({name: "Daily Use"}).populate("items").exec(function(err, categories){
//     if(err){
//         console.log("OH NO, ERROR!");
//         console.log(err);
//     } else {
//         console.log("ALL THE CATEGORIES with ITEMS.....");
//         console.log(categories);
//     }
// });

/*--------Items Update---------*/

// var bok = 0;
// var dnt = 0;
// var stk = 10;
// item.updateMany({},{book: bok, donate: dnt, stock: stk},function(err, updateditem){
//     if(err){
//         console.log(err);
//     } else{
//         console.log(updateditem);
//     }
// });

// order.find({}, function(err, orders){
//     if(err){
//         console.log("OH NO, ERROR!");
//         console.log(err);
//     } else {
//         console.log("ALL THE ORDERS.....");
//         console.log(orders);
//     }
// });

// message.find({}, function(err, orders){
//     if(err){
//         console.log("OH NO, ERROR!");
//         console.log(err);
//     } else {
//         console.log("ALL THE ORDERS.....");
//         console.log(orders);
//     }
// });
