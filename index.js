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
}).catch(err=>{
    console.log('some error occured ',err)
})
