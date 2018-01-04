var express = require("express");
var route = express.Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var Driver = require("../Models/driver.js");
var Vehicle = require("../Models/vehicle.js");

// Route to post our 'Create Driver' form submission to mongoDB via mongoose
route.post("/create-driver", function(req, res) {
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
    //then add that temp object into the db as a driver
    axios.get("https://maps.google.com/maps/api/geocode/json?key=AIzaSyDu3uARDgsUWZTKOQ_CItX7_grlIU11Ieo&address=" + address)
    .then(function(response) {
        let coords = response.data.results[0].geometry.location;
        tempObject.loc[0] = coords.lng;
        tempObject.loc[1] = coords.lat;
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

route.get("/get-driver/:id", function(req, res) {
    Driver.findOne({_id: req.params.id}).populate("vehicles")
    .then(function(dbDriver) {
        res.json(dbDriver);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//update Owner
route.put("/update-driver", function(req, res) {
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
        Driver.update({
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
                loc: tempObject.loc,
            }
        })
        .then(function(dbDriver) {
            res.json(dbDriver);
        })
        .catch(function(err) {
            // If an error occurs, send the error to the client
            res.json(err);
        });
    });
});

//Delete Driver
route.get("/delete-driver/:id", function(req, res) {
    //find the owner via id
    Driver.findOne({_id: req.params.id})
    .then((dbDriver) => {
        //for each vehicle the driver has
        dbDriver.vehicles.forEach(vehicleID => {
            console.log(vehicleID);
            //delete the actual vehicles
            Vehicle.remove({_id: vehicleID}, function(err, removed) {
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
    //then clear the vehicles from the drdiver array
    .then(() => {
        Driver.update({_id: req.params.id}, {
            $set: {
                vehicles: []
            }
        }, function(err, removed) {
            if (err) {
                console.log(err);
                res.send(err);
            }
        });
    })
    //then delete the actual driver
    .then(() => {
        Driver.remove({_id: req.params.id}, function(err, removed) {
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