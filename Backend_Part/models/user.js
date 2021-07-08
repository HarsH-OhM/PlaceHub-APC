const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }], //one user can have multiple places so made this as an aaray
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema); //first parameter is name of the model in First Uppercase later and second is schema name
