var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var DriverSchema = new Schema({
  // `date` must be of type Date. The default value is the current date
  driverCreated: {
    type: Date,
    default: Date.now
  },
  // `email` must be of type String
  // `email` must be unique
  // `email` must match the regex pattern below and throws a custom error message if it does not
  email: {
    type: String,
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
  },
  // `password` must be of type String
  // `password` will trim leading and trailing whitespace before it's saved
  // `password` is a required field and throws a custom error message if not supplied
  // `password` uses a custom validation function to only accept values 6 characters or more
  password: {
    type: String,
    trim: true,
    required: "Password is Required",
    validate: [
      function(input) {
        return input.length >= 6;
      },
      "Password should be longer."
    ]
  },
  firstName: {
    type: String,
    trim: true,
    required: "First Name is Required",
  },
  lastName: {
    type: String,
    trim: true,
    required: "Last Name is Required",
  },
  street: {
      type: String,
      required: "Address is Required"
  },
  city: {
      type: String,
      required: "City is Required"
  },
  state: {
      type: String,
      required: "State is Required"
  },
  zip: {
      type: Number,
      required: "Zip is Required"
  },
  loc: {
    type: [Number], //[<longitude>, <latitude>]
    index: '2d'
  },
  phoneNumber: {
    type: String,
    /*validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: '{VALUE} is not a valid phone number!'
    },*/
    required: [true, 'User phone number required']
  },
  type: {
    type: String,
    default: "driver"
  },
  vehicles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Vehicle"
    }
  ],
  rentals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rental"
    }
  ]
});

//hashing a password before saving it to the database
DriverSchema.pre('save', function(next) {
  let driver = this;
  bcrypt.hash(driver.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    driver.password = hash;
    next();
  })
});

DriverSchema.methods.validPassword = function( password, callback ) {
  bcrypt.compare(password, this.password, callback);
};

// This creates our model from the above schema, using mongoose's model method
var Driver = mongoose.model("Driver", DriverSchema);

// Export the Driver model
module.exports = Driver;
