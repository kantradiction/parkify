var express = require("express");
var route = express.Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var Owner = require("../Models/owner.js");
var ParkingSpot = require("../Models/parkingSpot.js");

// Route to post our 'Create Owner' form submission to mongoDB via mongoose
route.post("/create-owner", function(req, res) {
    //create temporary object of request body
    //then create address variable from temp objects address
    //then remove whitespace from address variable
    //then instantiate latitude and longitude properties of the temp object
    let tempObject = req.body;
    let address = tempObject.street + tempObject.city + tempObject.state + tempObject.zip;
    address.replace(/ /g,'');
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
    Owner.find({_id: req.params.id}).populate("parkingSpots")
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

module.exports = route;
