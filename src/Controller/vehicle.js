var express = require("express");
var route = express.Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var Vehicle = require("../Models/vehicle.js");
var Driver = require("../Models/driver.js");

// Route to post our 'Create Vehicle' form submission to mongoDB via mongoose
route.post("/create-vehicle", function(req, res) {
    // Create a new vehicle using req.body
    Vehicle.create(req.body)
    .then(function(dbVehicle) {
        //Then retrieve the vehicle owner via the driver id from the database response
        //then push the database object id to the drivers's vehicles array.
        Driver.update({
            "_id": dbVehicle.driverID
        }, {
            $push: {
                vehicles: dbVehicle._id
            }
        }, function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
        });
        // If saved successfully, send the the new User document to the client
        res.json(dbVehicle);
    })
    .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
    });
});

route.get("/get-vehicles", function(req, res) {
    Vehicle.find({})
    .then(function(dbVehicle) {
        res.json(dbVehicle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

module.exports = route;