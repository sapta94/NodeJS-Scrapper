const common = require('../common')
const axios = require('axios')
const htmlparser2 = require("htmlparser2");
const link = require('../Models/link')


module.exports.linkCrawler = async(req,res) => {
    var url = req.body.url||null;

    if(!url){
        return res.status(422).json({
            message:'Missing Parameters'
        })
    }

    let data = await fetchLinks(url,{},[],res)


}

let visitedArr=[]
function fetchLinks(url,linkDetails,linkArr,res){
    console.log('called for ',url)
    if(linkArr.length==0 && Object.keys(linkDetails).length!=0){
        console.log('length is done and dusted')
        return res.json({
            data,
            status:true
        })
    }

    return new Promise((resolve,reject)=>{
        const parser = new htmlparser2.Parser({
            onopentag(name, attribs) {
                if (name === "a") {
                    if (attribs.href.includes('medium.com/') && !visitedArr.includes(attribs.href)){
                        linkArr.push(attribs.href)
                        visitedArr.push(attribs.href)
                    }
                    
                }
            },
            onclosetag(tagname) {
                if (tagname === "a") {
                    //console.log("That's it?!");
                }
            },
        });
    
        axios.get(url).then(async resp=>{
            parser.write(
                resp.data
            );
            parser.end();
            if(linkArr.length==0){
                return resolve(linkDetails)
            }
            linkDetails = {...linkDetails,...common.parseLinksandStore(linkArr)};
            let keyArr = Object.keys(linkDetails)
            for (i in keyArr){
                item = keyArr[i]
                let eachLink={
                    linkName:item,
                    count:linkDetails[item]['count'],
                    params:linkDetails[item]['params']
                }
                let linkModel = new link(eachLink)
                try{
                    await linkModel.save()
                }catch(err){
                    console.log('mongo err', err)
                }
                
            }

            let toCrawlLinks = linkArr.slice(0,5)
            for (item in toCrawlLinks){
                await fetchLinks(toCrawlLinks[item],linkDetails,linkArr.slice(5,linkArr.length),res)
            }
            
            
        }).catch(err=>{
            console.log('some error occured ')
            console.log('Links --> ',linkArr.length)
            return resolve(linkDetails)
        })
    })
    
}