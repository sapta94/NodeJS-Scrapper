const axios = require('axios')
const htmlparser2 = require("htmlparser2");
const mongoose = require('mongoose');
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const link = require('./Models/link')




mongoose.connect(`mongodb+srv://code-talks:${process.env.DB_PASSWORD}@cluster0.f3qmg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{
  useNewUrlParser:true
},(err)=>{
  if(err){
    console.log('Some error occurerd while Connecting to DB',err)
    return
  }
  console.log('Successfully Connected to DB!')
})

linkArr=[]
const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
        if (name === "a") {
            if (attribs.href.includes('medium.com/')){
                linkArr.push(attribs.href)
            }
            
        }
    },
    onclosetag(tagname) {
        if (tagname === "a") {
            //console.log("That's it?!");
        }
    },
});


axios.get('https://medium.com').then(resp=>{
    parser.write(
        resp.data
    );
    parser.end();
    let linkDetails = parseLinksandStore();
    Object.keys(linkDetails).forEach(async (item)=>{
        let eachLink={
            linkName:item,
            count:linkDetails[item]['count'],
            params:linkDetails[item]['params']
        }
        console.log(eachLink)
        let linkModel = new link(eachLink)
        await linkModel.save()
    })
    
}).catch(err=>{
    console.log('some error occured ',err)
})

function parseLinksandStore(){
    linkObj={}
    linkArr.forEach(element => {
        let urlSplit = element.split('?')
        let domainName = urlSplit[0]
        if (domainName.slice(-1)=='/'){
            domainName = domainName.substring(0,domainName.length-1)
        }
        if(linkObj[domainName]){
            linkObj[domainName]['count']+=1
            linkObj[domainName]['params'].concat(getParameterList(urlSplit[1]))
        }else{
            linkObj[domainName]={
                count:1,
                params:getParameterList(urlSplit[1])
            }
        }
    });
    console.log(linkObj)
    return linkObj
}

function getParameterList(url){
    let keyValues=url.split('&')
    let keys = keyValues.map((item)=>{
        return item.split('=')[0]
    })
    return keys
}