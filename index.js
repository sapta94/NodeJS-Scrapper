const axios = require('axios')
const htmlparser2 = require("htmlparser2");

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
    parseLinksandStore();
    
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