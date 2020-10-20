const common = require('../common')
const axios = require('axios')
const htmlparser2 = require("htmlparser2");
const link = require('../Models/link')

//main module that runs on api call
module.exports.linkCrawler = async(req,res) => {
    var url = req.body.url||null;

    if(!url){
        return res.status(422).json({
            message:'Missing Parameters'
        })
    }

    let data = await fetchLinks(url,{},[],res)
    return res.json({
        data,
        status:true
    })
}

//globall arr that helps to track all the links visited till now
let visitedArr=[]

/**recursive function that parses links in a web page and then returns the list of links in the parsed page 
 * url - The url that the funcrion will crawl
 * linkDetails - An object which contains details of each link, like count of each links and params
 * linkArr - This is a queue, which contains the links to be crawled
*/
function fetchLinks(url,linkDetails,linkArr,res){
    console.log('called for ',url)
    
    //promise to synchronize multiple url calls
    return new Promise((resolve,reject)=>{

        //base condition for recursion to break
        if(linkArr.length==0 && Object.keys(linkDetails).length!=0){
            console.log('length is done and dusted')
            return resolve(linkDetails)
        }

        //parser that parses the html response and returns the <a> tags
        const parser = new htmlparser2.Parser({
            onopentag(name, attribs) {
                if (name === "a") {
                    //if <a> tag encountered then check if it is visited or not and is of medium.com domain
                    let domainName = attribs.href.split('?')[0]
                    if (domainName.slice(-1)=='/'){
                        domainName = domainName.substring(0,domainName.length-1)
                    }
                    if (attribs.href.includes('medium.com/') && !visitedArr.includes(domainName)){
                        linkArr.push(attribs.href)
                        visitedArr.push(domainName)
                    }
                    
                }
            },
            onclosetag(tagname) {
                if (tagname === "a") {
                    //console.log('Link parsed')
                }
            },
        });
        
        //call the url using axios
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

            //save each link details in db
            for (i in keyArr){
                item = keyArr[i]
                let eachLink={
                    linkName:item,
                    count:linkDetails[item]['count'],
                    params:linkDetails[item]['params']
                }
                let linkModel = new link(eachLink)
                try{
                    let exists = await link.findOne({linkName:item})
                    //check if link already exists , then update count else insert 
                    if(exists && exists['count']>0){
                        //console.log(exists)
                        let newParams = exists.params.concat(eachLink.params)
                        let newCount = parseInt(exists['count'])+1
                        console.log('newCount is ',newCount)
                        await link.updateOne({linkName:item},{$set:{linkName:item,count:newCount,params:newParams}})
                    }
                    else{
                        await linkModel.save()
                    }
                    
                }catch(err){
                    console.log('mongo err', err)
                }
                
            }

            //deque first 5 links from linkArr
            let toCrawlLinks = linkArr.slice(0,5)
            for (item in toCrawlLinks){
                //recursively call the 5 dequed urls 
                await fetchLinks(toCrawlLinks[item],linkDetails,linkArr.slice(5,linkArr.length),res)
            }
            
        }).catch(async err=>{
            console.log('some error occured ')
            console.log('Links --> ',linkArr.length)
            
            //deque first 5 links from linkArr
            let toCrawlLinks = linkArr.slice(0,5)
            for (item in toCrawlLinks){
                //recursively call the 5 dequed urls 
                await fetchLinks(toCrawlLinks[item],linkDetails,linkArr.slice(5,linkArr.length),res)
            }
        })
    })
    
}


module.exports.findLinksDetails=async (req,res)=>{
    let url = req.body.url||null;
    let data=[]
    try{
        if(url){
            data = await link.find({linkName:url})
        }else{
            data = await link.find()
        }
        return res.json({
            data,
            status:true
        })
    }catch(err){
        console.log('some error occured ',err)
        return res.status(500).json({
            status:false,
            data
        })
    }
}