var express = require("express");
var route = express.Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var ParkingSpot = require("../Models/parkingSpot.js");
var Owner = require("../Models/owner.js");

// Route to post our 'Create Parking Spot' form submission to mongoDB via mongoose
route.post("/create-parking-spot", function(req, res) {
    //create temporary object of request body
    //then create address variable from temp objects address
    //then remove whitespace from address variable
    //then instantiate latitude and longitude properties of the temp object
    let tempObject = req.body;
    let address = tempObject.street + tempObject.city + tempObject.state + tempObject.zip;
    address.replace(/ /g,'');
    tempObject.lat = 0;
    tempObject.lng = 0;

    //use axios to pass address into google to return coordinates 
    //then add those coordinates to the temp object
    //then add that temp object into the db as an parking spot
    axios.get("https://maps.google.com/maps/api/geocode/json?key=AIzaSyDu3uARDgsUWZTKOQ_CItX7_grlIU11Ieo&address=" + address)
    .then(function(response) {
        let coords = response.data.results[0].geometry.location;
        tempObject.lat = coords.lat;
        tempObject.lng = coords.lng;
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
                if (err) {
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
    ParkingSpot.find({})
    .then(function(dbParkingSpot) {
        res.json(dbParkingSpot);
    })
    .catch(function(err) {
        res.json(err);
    });
});

module.exports = route;