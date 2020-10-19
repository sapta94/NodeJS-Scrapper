//funtion that separates the domain and parameters and sets count and param for each link
function parseLinksandStore(linkArr){
    linkObj={}
    linkArr.forEach((element,index) => {
        let urlSplit = element.split('?')
        let domainName = urlSplit[0]
        if (domainName.slice(-1)=='/'){
            domainName = domainName.substring(0,domainName.length-1)
        }
        let paramList = (urlSplit[1])?getParameterList(urlSplit[1]):[]
        if(linkObj[domainName]){
            linkObj[domainName]['count']+=1
            linkObj[domainName]['params'].concat(paramList)
        }else{
            linkObj[domainName]={
                count:1,
                params:paramList
            }
        }
    });
    return linkObj
}
//function to return the parameter names from a url
function getParameterList(url){
    let keyValues=url.split('&')
    let keys = keyValues.map((item)=>{
        return item.split('=')[0]
    })
    return keys
}

module.exports ={
    getParameterList,
    parseLinksandStore
}