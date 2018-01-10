var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var axios = require("axios");
var session = require('express-session');
var passport = require("passport");
/*var Passport = require('passport').Passport,
    passport = new Passport(),
    driverPassport = new Passport();*/
var flash = require("connect-flash");
var MongoStore = require("connect-mongo")(session);

var PORT = 3000;

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
var db = mongoose.connection;

//Temporary Objects
let loggedInOwner = {};
let loggedInDriver = {};

//use sessions for tracking logins
app.use("/owner", session({
  name: "owner",
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use("/driver", session({
  name: "driver",
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(passport.initialize());
app.use(passport.session());
/*app.use(driverPassport.initialize());
app.use(driverPassport.session());*/
app.use(flash());

//use sessions for tracking logins
/*app.use(express.session({
  secret: 'a4f8071f-c873-4447-8ee2',
  cookie: { maxAge: 2628000000 },
  store: new (require('express-sessions'))({
      storage: 'mongodb',
      instance: mongoose, // optional 
      host: 'localhost', // optional 
      port: 3000, // optional 
      db: 'parkify', // optional 
      collection: 'sessions', // optional 
      expire: 86400 // optional 
  })
}));*/



//Routes
var indexRoute = require("./Controller/index.js");
app.use("/", indexRoute);
var ownerRoute = require("./Controller/owner.js");
app.use("/", ownerRoute);
var driverRoute = require("./Controller/driver.js");
app.use("/", driverRoute);
var parkingSpotRoute = require("./Controller/parkingSpot.js");
app.use("/", parkingSpotRoute);
var vehicleRoute = require("./Controller/vehicle.js");
app.use("/", vehicleRoute);
var rentalRoute = require("./Controller/rental.js");
app.use("/", rentalRoute);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");  
});
