const router = (packages) => {
    const apiRoutes = packages.express.Router();
    const {
        linkCrawler,findLinksDetails
      } = require('../controller/link-controller');
      
    apiRoutes.route('/start')
    .post(linkCrawler);

    apiRoutes.route('/find')
    .post(findLinksDetails);

    return apiRoutes
}

module.exports = router;