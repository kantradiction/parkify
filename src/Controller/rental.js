var express = require("express");
var route = express.Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var Rental = require("../Models/rental.js");
var Owner = require("../Models/owner.js");
var ParkingSpot = require("../Models/parkingSpot.js");
var Vehicle = require("../Models/vehicle.js");
var Driver = require("../Models/driver.js");
var _this = this;

route.post("/create-rental", function(req, res) {
    Rental
        .create(req.body)
        .then(function(dbRental) {
            //Add rental ID to Owners's Rental history Array
            Owner.update({
                "_id": dbRental.ownerID
            }, {
                $push: {
                    rentals: dbRental._id
                }
            }, function(err) {
                if (this.err) {
                    console.log(err);
                    res.send(err);
                }
            });

            //Add rental ID to Parking spot's Rental history Array
            ParkingSpot.update({
                "_id": dbRental.parkingSpotID
            }, {
                $push: {
                    rentals: dbRental._id
                }
            }, function(err) {
                if (this.err) {
                    console.log(err);
                    res.send(err);
                }
            });

            //Add rental ID to Driver's Rental history Array
            Driver.update({
                "_id": dbRental.driverID
            }, {
                $push: {
                    rentals: dbRental._id
                }
            }, function(err) {
                if (this.err) {
                    console.log(err);
                    res.send(err);
                }
            });

            //Add rental ID to Vehicle's Rental history Array
            Vehicle.update({
                "_id": dbRental.vehicleID
            }, {
                $push: {
                    rentals: dbRental._id
                }
            }, function(err) {
                if (this.err) {
                    console.log(err);
                    res.send(err);
                }
            });

            res.json(dbRental);
        }).catch(function(err) {
            // If an error occurs, send the error to the client
            res.json(err);
        });
});

route.get("/get-rental/:id", function(req, res) {
    Rental
        .findOne({})
        .populate("ownerID")
        .populate("parkingSpotID")
        .populate("driverID")
        .populate("vehicleID")
        .then(function(dbRental) {
            res.json(dbRental);
        })
        .catch(function(err) {
            res.json(err);
        });
});

route.get("/get-rentals", function(req, res) {
    Rental
        .find({})
        .populate("ownerID")
        .populate("parkingSpotID")
        .populate("driverID")
        .populate("vehicleID")
        .then(function(dbRental) {
            res.json(dbRental);
        })
        .catch(function(err) {
            res.json(err);
        });
});

route.post("/update-rental/:id", function(req, res) {

    let tempRental = req.body;
    
    Rental.update({
        _id:req.params.id
    }, {
        $set: {
            status: req.body.status,
            rate: req.body.rate
        }
    })
    .then(function() {
        console.log("parkingspot update");
        Rental.findOne({
            _id: req.params.id
        })
        .then(function(dbRental) {
            console.log(dbRental.parkingSpotID);
            ParkingSpot.update({
                _id:dbRental.parkingSpotID
            }, {
                $set: {
                    availability: "available"
                }
            }, function(err) {
                if (this.err) {
                    console.log(err);
                    res.send(err);
                }
            });
        });
    })
    .then(function(dbRental) {
        console.log("dbRental");
        console.log(dbRental);
        res.json(dbRental);
    })
    .catch(function(err) {
        console.log("err");
        // If an error occurs, send the error to the client
        res.json(err);
    });
});

route.get("/update-rental/:id/:status", function(req, res) {

    if (req.params.status === "active") {
        Rental.update({
            _id:req.params.id
        }, {
            $set: {
                status: req.params.status
            }
        })
        .then(function(dbRental) {
            ParkingSpot.update({
                _id:dbRental.parkingSpotID
            }, {
                $set: {
                    availability: "occcupied"
                }
            });
        })
        .then(function(dbRental) {
            res.json(dbRental);
        })
        .catch(function(err) {
            // If an error occurs, send the error to the client
            res.json(err);
        });
    } else {
        Rental.update({
            _id:req.params.id
        }, {
            $set: {
                status: req.params.status
            }
        })
        .then(function(dbRental) {
            ParkingSpot.update({
                _id:dbRental.parkingSpotID
            }, {
                $set: {
                    availability: "available"
                }
            });
        })
        .then(function(dbRental) {
            res.json(dbRental);
        })
        .catch(function(err) {
            // If an error occurs, send the error to the client
            res.json(err);
        });
    }
});

route.get("/update-rental/:id/:rate", function(req, res) {
    Rental.update({
        _id:req.params.id
    }, {
        $set: {
            rate: req.params.rate
        }
    })
    .then(function(dbRental) {
        res.json(dbRental);
    })
    .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
    });
});

route.get("/delete-rental/:id", function(req, res) {
    //find the rental via id to get the ownerid
    Rental
        .findOne({_id: req.params.id})
        .then((dbRental) => {
            Owner.update({
                _id: dbRental.ownerID
            }, {
                //then remove the parking spot id from the owners parkingspots array
                $pull: {
                    rentals: dbRental._id
                }
            }, function(err, removed) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                console.log(removed);
            });

            ParkingSpot
                .update({
                    _id: dbRental.parkingSpotID
                }, {
                    //then remove the parking spot id from the owners parkingspots array
                    $pull: {
                        rentals: dbRental._id
                    }
                }, function(err, removed) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                });

            Driver
                .update({
                    _id: dbRental.driverID
                }, {
                    //then remove the parking spot id from the owners parkingspots array
                    $pull: {
                        rentals: dbRental._id
                    }
                }, function(err, removed) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                });

            Vehicle
                .update({
                    _id: dbRental.vehicleID
                }, {
                    //then remove the parking spot id from the owners parkingspots array
                    $pull: {
                        rentals: dbRental._id
                    }
                }, function(err, removed) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                });
                
        })
        //then delete the rental
        .then(() => {
            
            Rental.remove({
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