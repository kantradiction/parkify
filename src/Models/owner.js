var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var OwnerSchema = new Schema({
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
    required: "First Name is Required",
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: Number,
    required: true
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
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
  parkingSpots: [
    {
      type: Schema.Types.ObjectId,
      ref: "ParkingSpot"
    }
  ],  
  // `date` must be of type Date. The default value is the current date
  ownerCreated: {
    type: Date,
    default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Owner = mongoose.model("Owner", OwnerSchema);

// Export the Owner model
module.exports = Owner;
