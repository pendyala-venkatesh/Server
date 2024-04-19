const mongoose = require("mongoose")
 const signupdata = new mongoose.Schema({
username:{
    type: String,
    required: true,
},

email:{
    type: String,
    required:true,
},
mobilenumber:{
    type: String,
    required:true,
},
gender:{
    type: String,
    required:true,
},
password:{
    type: String,
    required:true,
},
confirmpassword:{
    type: String,
    required:true,
},

 });

 const User = mongoose.model("signupDetails",signupdata)
 module.exports = User;