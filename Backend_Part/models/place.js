const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" }, //making realtion and providing user id from User schema
});

module.exports = mongoose.model("Place", placeSchema); //first parameter is name of the model in First Uppercase later and second is schema name
