
const mongoose = require('mongoose');
const path = require("path");
const express = require('express')
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json({limit: "10mb"}));
app.use(bodyParser.urlencoded({ extended: false }));

//Connect to mongoose server
mongoose.connect('mongodb://mongo:27017/'+process.env.CONFIG_MONGODB_ADMINDB, {
  useNewUrlParser: true,
  user: process.env.CONFIG_MONGODB_ADMINUSERNAME,
  pass: process.env.CONFIG_MONGODB_ADMINPASSWORD
},(err)=>{
  if(err){
    console.log('Some error occurerd while Connecting to DB',err)
    return
  }
  console.log('Successfully Connected to DB!')
})

const packages = {
    app,
    express,
};

//import the routes and pass packages to the routes routes
require('./routes')(packages)

var port = process.env.PORT||5000;

//start the server
app.listen(port, () =>
  console.log(
    `App is now running on port ${process.env.PORT}`
  )
);