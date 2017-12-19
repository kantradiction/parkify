var express = require("express");
var route = express.Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var Owner = require("../Models/owner.js");

// Route to post our 'Create Owner' form submission to mongoDB via mongoose
route.post("/create-owner", function(req, res) {
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
    //then add that temp object into the db as an owner
    axios.get("https://maps.google.com/maps/api/geocode/json?key=AIzaSyDu3uARDgsUWZTKOQ_CItX7_grlIU11Ieo&address=" + address)
    .then(function(response) {
        let coords = response.data.results[0].geometry.location;
        tempObject.lat = coords.lat;
        tempObject.lng = coords.lng;
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

//put route

route.put("/update-owner:id", function(req, res) {
    Owner.find({_id:req.params._id})
})

module.exports = route;
