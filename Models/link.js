const mongoose = require('mongoose');

//Model for a link document to be stored in DB
let link = new mongoose.Schema({
    linkID:mongoose.Types.ObjectId,
    linkName:String,
    count:Number,
    params:Array
})

module.exports = link = mongoose.model('link',link)