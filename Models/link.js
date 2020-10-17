const mongoose = require('mongoose');

let link = new mongoose.Schema({
    linkID:mongoose.Types.ObjectId,
    linkName:String,
    count:Number,
    params:Array
})

module.exports = link = mongoose.model('link',link)