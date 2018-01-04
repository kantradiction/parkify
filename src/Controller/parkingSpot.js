var express = require("express");
var route = express.Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var ParkingSpot = require("../Models/parkingSpot.js");
var Owner = require("../Models/owner.js");
var _this = this;

// Route to post our 'Create Parking Spot' form submission to mongoDB via mongoose
route.post("/create-parking-spot", function(req, res) {
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
        let coords = response.data.results[0].geometry.location;
        tempObject.loc[0] = coords.lng;
        tempObject.loc[1] = coords.lat;
    }).then(function() {
        // Create a new parking spot using the temp object
        ParkingSpot.create(tempObject)
        .then(function(dbParkingSpot) {
            //Then retrieve the parking spots owner via the owner id from the database response
            //then push the database object id to the owner's parking spots array.
            Owner.update({
                "_id": dbParkingSpot.ownerID
            }, {
                $push: {
                    parkingSpots: dbParkingSpot._id
                }
            }, function(err) {
                if (this.err) {
                    console.log(err);
                    res.send(err);
                }
            });
            // If saved successfully, send the the new User document to the client
            res.json(dbParkingSpot);
        })
        .catch(function(err) {
            // If an error occurs, send the error to the client
            res.json(err);
        });
    });
});

route.get("/get-parking-spots", function(req, res) {
    ParkingSpot.find({}).populate("ownerID")
    .then(function(dbParkingSpot) {
        res.json(dbParkingSpot);
    })
    .catch(function(err) {
        res.json(err);
    });
});

route.get("/get-parking-spot/:id", function(req, res) {
    ParkingSpot.find({_id: req.params.id}).populate("ownerID")
    .then(function(dbParkingSpot) {
        res.json(dbParkingSpot);
    })
    .catch(function(err) {
        res.json(err);
    });
});

route.put("/update-parking-spot", function(req, res) {
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
        //lng comes first
        tempObject.loc[0] = coords.lng;
        tempObject.loc[1] = coords.lat;
    }).then(function() {
        // Update parking spot using the temp object
        ParkingSpot.update({
            _id:req.body._id
        }, {
            $set: {
                name: tempObject.name,
                street: tempObject.street,
                city: tempObject.city,
                state: tempObject.state,
                zip: tempObject.zip,
                loc: tempObject.loc
            }
        })
        .then(function(dbParkingSpot) {
            res.json(dbParkingSpot);
        })
        .catch(function(err) {
            // If an error occurs, send the error to the client
            res.json(err);
        });
    });
});

route.get("/delete-parking-spot/:id", function(req, res) {
    //5a39d51be4888f04988d910d
    //find the parkingspot via id to get the ownerid
    ParkingSpot.findOne({_id: req.params.id}, () => {
        //then find the owner of the parkingspot
        console.log("find parking spot");
    })
    .then((dbParkingSpot) => {
        console.log("dbparkingSpotId");
        console.log(dbParkingSpot.ownerID);
        Owner.update({
            _id: dbParkingSpot.ownerID
        }, {
            //then remove the parking spot id from the owners parkingspots array
            $pull: {
                parkingSpots: dbParkingSpot._id
            }
        }, function(err, removed) {
            if (err) {
                console.log(err);
                res.send(err);
            }
        });
    })
    //then delete the parking spot
    .then(() => {
        console.log("parkingSpot.remove");
        ParkingSpot.remove({
            _id: req.params.id
        }, function(err, removed) {
            // Log any errors from mongojs
            if (err) {
                console.log(err);
                res.send(err);
            }
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            else {
                res.send(removed);
            }
        });
    });
});

route.get("/findNear", function(req, res, next) {
    let limit = req.query.limit || 10;
    
    // get the max distance or set it to 8 miles
    let maxDistance = req.query.distance;

    // we need to convert the distance to radians
    // the radius of the Earth is approximately 3959 miles
    maxDistance /= 3963.192;

    // get coordinates [ <longitude> , <latitude> ]
    let coords = [];
    coords[0] = req.query.longitude;
    coords[1] = req.query.latitude;

    //find a location
    ParkingSpot
    .find({
        loc: {
            $nearSphere: coords,
            $maxDistance: maxDistance
        }
    })
    .populate("ownerID")
    /*.limit(limit)*/
    .exec((err, locations) => {
        if (err) {
            res.send(err);
        }

        res.send(locations);
    });
});

module.exports = route;