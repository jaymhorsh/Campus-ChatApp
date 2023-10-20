const mongoose = require("mongoose");

//User Schema is the data structure of collection in the mongodb database
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    matricNum: {type: Number , required: true,  unique: true },
    birthDate: { type: Date, required: true },
    deptValue: { type: String, required: true },
    email: {type:String, required: true, index: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, min:6},
  },
  {timestamps: true},
  { collection: "users" }
);
// Create a collection in mongodb called user based on the field or properties in userSchema
const User = mongoose.model("user", userSchema);

module.exports = User;
