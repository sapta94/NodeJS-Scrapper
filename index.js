
const mongoose = require('mongoose');
const path = require("path");
const express = require('express')
const app = express();
const bodyParser = require('body-parser')

require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

app.use(bodyParser.json({limit: "10mb"}));
app.use(bodyParser.urlencoded({ extended: false }));

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
// mongoose.connect(`mongodb+srv://code-talks:${process.env.DB_PASSWORD}@cluster0.f3qmg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{
//   useNewUrlParser:true
// },(err)=>{
//   if(err){
//     console.log('Some error occurerd while Connecting to DB',err)
//     return
//   }
//   console.log('Successfully Connected to DB!')
// })

const packages = {
    app,
    express,
};

require('./routes')(packages)

var port = process.env.PORT||5000;
app.listen(port, () =>
  console.log(
    `App is now running on port ${process.env.PORT}`
  )
);