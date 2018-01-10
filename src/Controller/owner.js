var express = require("express");
var route = express.Router();
/*var app = express();*/
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var Owner = require("../Models/owner.js");
var Driver = require("../Models/driver.js");
var ParkingSpot = require("../Models/parkingSpot.js");
var passport = require('passport');
/*var Passport = require('passport').Passport,
    ownerPassport = new Passport();*/
var LocalStrategy = require('passport-local').Strategy;
var parser = require('body-parser');
var urlencodedParser = parser.urlencoded({extended : false});



// Route to post our 'Create Owner' form submission to mongoDB via mongoose
route.post("/create-owner", function(req, res) {
    //create temporary object of request body
    //then create address variable from temp objects address
    //then remove whitespace from address variable
    //then instantiate latitude and longitude properties of the temp object
    let tempObject = req.body;
    let address = tempObject.street + tempObject.city + tempObject.state + tempObject.zip;
    // address.replace(/ /g,'');
    tempObject.loc = [];

    //use axios to pass address into google to return coordinates 
    //then add those coordinates to the temp object
    //then add that temp object into the db as an owner
    axios.get("https://maps.google.com/maps/api/geocode/json?key=AIzaSyDu3uARDgsUWZTKOQ_CItX7_grlIU11Ieo&address=" + address)
    .then(function(response) {
        let coords = response.data.results[0].geometry.location;
        tempObject.loc[0] = coords.lng;
        tempObject.loc[1] = coords.lat;
    }).then(function() {
        Owner.create(tempObject)
        .then(function(dbOwner) {
            // If saved successfully, send the the new User document to the client
            res.json(dbOwner);
        })
        .catch(function(err) {
            // If an error occurs, send the error to the client
            res.json(err);
        });
    });
});

route.get("/get-owners", function(req, res) {
    Owner.find({}).populate("parkingSpots")
    .then(function(dbOwner) {
        res.json(dbOwner);
    })
    .catch(function(err) {
        res.json(err);
    });
});

route.get("/get-owner/:id", function(req, res) {
    Owner.findOne({_id: req.params.id}).populate("parkingSpots")
    .then(function(dbOwner) {
        res.json(dbOwner);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//update Owner
route.put("/update-owner", function(req, res) {
    //create temporary object of request body
    //then create address variable from temp objects address
    //then remove whitespace from address variable
    //then instantiate latitude and longitude properties of the temp object
    let tempObject = req.body;
    const address = tempObject.street + tempObject.city + tempObject.state + tempObject.zip;
    address.replace(/ /g,'');
    tempObject.loc = [];

    //use axios to pass address into google to return coordinates 
    //then add those coordinates to the temp object
    //then add that temp object into the db as an parking spot
    axios.get("https://maps.google.com/maps/api/geocode/json?key=AIzaSyDu3uARDgsUWZTKOQ_CItX7_grlIU11Ieo&address=" + address)
    .then(function(response) {
        const coords = response.data.results[0].geometry.location;
        tempObject.loc[0] = coords.lng;
        tempObject.loc[1] = coords.lat;
    }).then(function() {
        // Update parking spot using the temp object
        Owner.update({
            _id:req.body._id
        }, {
            $set: {
                firstName: tempObject.firstName,
                lastName: tempObject.lastName,
                email: tempObject.email,
                phoneNumber: tempObject.phoneNumber,
                street: tempObject.street,
                city: tempObject.city,
                state: tempObject.state,
                zip: tempObject.zip,
                loc: tempObject.loc
            }
        })
        .then(function(dbOwner) {
            res.json(dbOwner);
        })
        .catch(function(err) {
            // If an error occurs, send the error to the client
            res.json(err);
        });
    });
});

//Delete Owner
route.get("/delete-owner/:id", function(req, res) {
    //find the owner via id
    Owner.findOne({_id: req.params.id})
    .then((dbOwner) => {
        //for each parking spot the owner has
        dbOwner.parkingSpots.forEach(parkingSpotId => {
            console.log(parkingSpotId);
            //delete the actual parking spots
            ParkingSpot.remove({_id: parkingSpotId}, function(err, removed) {
                // Log any errors from mongojs
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                // Otherwise, send the mongojs response to the browser
                // This will fire off the success function of the ajax request
            });
        });
    })
    //then clear the parking spots from the owner array
    .then(() => {
        Owner.update({_id: req.params.id}, {
            $set: {
                parkingSpots: []
            }
        }, function(err, removed) {
            if (err) {
                console.log(err);
                res.send(err);
            }
        });
    })
    //then delete the actual owner
    .then(() => {
        Owner.remove({_id: req.params.id}, function(err, removed) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(removed);
            }
        });
    });
});

//login owner
route.post("/owner/login-owner", function(req, res, next) {
    passport.authenticate("owner", function(err, user, info) {
        if (err) { return next(err); } 
        if (!user) {
            console.log("Cannot find owner");
            return res.sendStatus(401);
        }
        req.logIn(user, function(err) {
            console.log(user);
            if (err) { return next(err ); }
            console.log("Owner logged in");
            return res.status(200).json({ownerID: user._id});
        });
    })(req, res, next);
});

//logout owner
route.get('/owner/logout-owner',function(req, res){
    // clears session from node but not from db
    console.log(req.session);
    req.logout(); 
    //removes session from db
    req.session.destroy(function (err) {
        res.sendStatus(200);
    });
});

passport.use('owner', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},   
function(req, email, password, done) {
  Owner.findOne({ email: email }, function (err, owner) {
    if (err) { return done(err); }
    if (!owner) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    owner.validPassword(password, function(err, res) {
        if (err) {
            console.log(err);
            done(err);
        }
        if (res) {
            done(null, owner);
        } else {
            done();
        }
    }); 
  });
}
));

passport.serializeUser(function(owner, done) {
console.log("Serialize User Owner");
console.log(owner);
done(null, owner);
});

passport.deserializeUser(function(user, done) {
/*Owner.findById(user._id, function(err, owner) {
    done(err, owner);
});*/
if (user.type === "owner") {
    console.log("deserialize user owner - owner");
    Owner.findById(user._id, function(err, owner) {
        done(err, owner);
    });
} else {
    console.log("deserialize user owner - driver");
    Driver.findById(user._id, function(err, driver) {
        done(err, driver);
    });
}
});

const ensureAuthenticated = function(req, res, next){
    console.log(req);
if(req.isAuthenticated()) {
   return next();
}
else
    return res.status(401).json({
        error: 'Owner not authenticated'
    })
}

route.get('/owner/check-owner-auth', ensureAuthenticated, function(req, res){
    res.status(200).json({
        status: 'Owner Login successful!'
    });
});

module.exports = route;
