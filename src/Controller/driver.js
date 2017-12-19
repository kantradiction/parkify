var express = require("express");
var route = express.Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var Driver = require("../Models/driver.js");

// Route to post our 'Create Driver' form submission to mongoDB via mongoose
route.post("/create-driver", function(req, res) {
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
    //then add that temp object into the db as a driver
    axios.get("https://maps.google.com/maps/api/geocode/json?key=AIzaSyDu3uARDgsUWZTKOQ_CItX7_grlIU11Ieo&address=" + address)
    .then(function(response) {
        let coords = response.data.results[0].geometry.location;
        tempObject.lat = coords.lat;
        tempObject.lng = coords.lng;
    }).then(function() {
       // Create a new user using req.body
        Driver.create(tempObject)
        .then(function(dbDriver) {
            // If saved successfully, send the the new User document to the client
            res.json(dbDriver);
        })
        .catch(function(err) {
            // If an error occurs, send the error to the client
            res.json(err);
        });
    });
});

route.get("/get-drivers", function(req, res) {
    Driver.find({}).populate("vehicles")
    .then(function(dbDriver) {
        res.json(dbDriver);
    })
    .catch(function(err) {
        res.json(err);
    });
});

module.exports = route;