var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

var PORT = 3000;

// Requiring the `Owner` model for accessing the `owners` collection
var Owner = require("./ownerModel.js");
// Requiring the `Driver` model for accessing the `drivers` collection
var Driver = require("./driverModel.js");
// Requiring the `ParkingSpot` model for accessing the `parking spots` collection
var ParkingSpot = require("./parkingSpotModel.js");
// Requiring the `Vehicle` model for accessing the `vehicles` collection
var Vehicle = require("./vehicleModel.js");


// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/parkify", {
  useMongoClient: true
});

// Routes

// Route to post our 'Create Owner' form submission to mongoDB via mongoose
app.post("/create-owner", function(req, res) {
  // Create a new user using req.body
  /*Owner.create(req.body)
    .then(function(dbOwner) {
      // If saved successfully, send the the new User document to the client
      res.json(dbOwner);
    })
    .catch(function(err) {
      // If an error occurs, send the error to the client
      res.json(err);
    });*/

    Owner.create({
        email: "test@tested.com", 
        password: "123456", 
        firstName: "OwnerFirstName", 
        lastName: "OwnerLastName", 
        address: {
            street: "123 W Main St", 
            city: "Phoenix", 
            state: "AZ", 
            zip: 85027
        }, 
        phoneNumber: "123-456-7890",
        ownerCreated: Date.now()
    });
});

// Route to post our 'Create Driver' form submission to mongoDB via mongoose
app.post("/create-driver", function(req, res) {
    // Create a new user using req.body
    /*Driver.create(req.body)
      .then(function(dbDriver) {
        // If saved successfully, send the the new User document to the client
        res.json(dbDriver);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });*/

    Driver.create({
        email: "test@tested.com", 
        password: "123456", 
        firstName: "DriverFirstName", 
        lastName: "DriverLastName", 
        address: {
            street: "123 W Main St", 
            city: "Phoenix", 
            state: "AZ", 
            zip: 85027
        }, 
        phoneNumber: "123-456-7890",
       driverCreated: Date.now() 
    });
  });

  // Route to post our 'Create Parking Spot' form submission to mongoDB via mongoose
app.post("/create-parking-spot", function(req, res) {
    // Create a new user using req.body
    /*ParkingSpot.create(req.body)
      .then(function(dbParkingSpot) {
        // If saved successfully, send the the new User document to the client
        res.json(dbParkingSpot);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });*/

      ParkingSpot.create({
        address: {
            street: "123 W Main St", 
            city: "Phoenix", 
            state: "AZ", 
            zip: 85027
        }, 
        parkingSpotCreated: Date.now() 
      });
  });

  // Route to post our 'Create Vehicle' form submission to mongoDB via mongoose
app.post("/create-vehicle", function(req, res) {
    // Create a new user using req.body
    /*Vehicle.create(req.body)
      .then(function(dbVehicle) {
        // If saved successfully, send the the new User document to the client
        res.json(dbVehicle);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });*/

      Vehicle.create({
        make: "Lexus",
        model: "LX470",
        year: 2000,
        color: "white",
        vehicleCreated: Date.now()
      });

  });

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/get-owners", function(req, res) {
    Owner.find({})
    .then(function(dbOwner) {
        res.json(dbOwner);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/get-drivers", function(req, res) {
    Driver.find({})
    .then(function(dbDriver) {
        res.json(dbDriver);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/get-parking-spots", function(req, res) {
    ParkingSpot.find({})
    .then(function(dbParkingSpot) {
        res.json(dbParkingSpot);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/get-vehicles", function(req, res) {
    Vehicle.find({})
    .then(function(dbVehicle) {
        res.json(dbVehicle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");  
});
