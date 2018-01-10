var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var OwnerSchema = new Schema({
  ownerCreated: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
  },
  password: {
    type: String,
    trim: true,
    //required: "Password is Required",
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
    //required: "First Name is Required",
  },
  lastName: {
    type: String,
    trim: true,
    //required: "First Name is Required",
  },
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: Number,
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
  },
  type: {
    type: String,
    default: "owner"
  },
  parkingSpots: [
    {
      type: Schema.Types.ObjectId,
      ref: "ParkingSpot"
    }
  ],  
  rentals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rental"
    }
  ]
});

//authenticate input against database
/*OwnerSchema.statics.authenticate = function(email, password, callback) {
  Owner
    .findOne({ email: email})
    .exec(function(err, owner) {
      if(err) {
        return callback(err);
      } else if (!owner) {
        let err = new Error("Owner Not Found.");
        err.status = 401;
        return callback(err);
      }

      bcrypt.compare(password, owner.password, function(err, result) {
        if (result === true) {
          return callback(null, owner);
        } else {
          return callback();
        }
      });
    });
};*/

//hashing a password before saving it to the database
OwnerSchema.pre('save', function(next) {
  let owner = this;
  bcrypt.hash(owner.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    owner.password = hash;
    next();
  })
});

OwnerSchema.methods.validPassword = function( password, callback ) {
  bcrypt.compare(password, this.password, callback);
};

// This creates our model from the above schema, using mongoose's model method
var Owner = mongoose.model("Owner", OwnerSchema);

// Export the Owner model
module.exports = Owner;
