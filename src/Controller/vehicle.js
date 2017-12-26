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
    Vehicle.find({}).populate("driverID")
    .then(function(dbVehicle) {
        res.json(dbVehicle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

route.get("/get-vehicle/:id", function(req, res) {
    Vehicle.find({_id: req.params.id}).populate("driverID")
    .then(function(dbVehicle) {
        res.json(dbVehicle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

route.put("/update-vehicle", function(req, res) {
    // Update parking spot using the temp object
    vehicle.update({
        _id:req.body._id
    }, {
        $set: {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            color: req.body.color,
        }
    })
    .then(function(dbParkingSpot) {
        res.json(dbParkingSpot);
    })
    .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
    });
})

route.get("/delete-vehicle/:id", function(req, res) {
    //5a39d51be4888f04988d910d
    //find the vehicle via id to get the driverID
    Vehicle.find({_id: req.params.id}, () => {
        //then find the owner of the vehicle
        console.log("find vehicle");
    })
    .then((dbVehicle) => {
        console.log("dbVehicleId");
        console.log(dbVehicle[0].driverID);
        Driver.update({
            _id: dbVehicle[0].driverID
        }, {
            //then remove the vehicle id from the drivers vehicles array
            $pull: {
                vehicles: dbVehicle[0]._id
            }
        }, function(err, removed) {
            if (err) {
                console.log(err);
                res.send(err);
            }
        });
    })
    //then delete the vehicle
    .then(() => {
        console.log("vehicle.remove");
        Vehicle.remove({
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

module.exports = route;