const router = (packages) => {
    const apiRoutes = packages.express.Router();
    const {
        linkCrawler
      } = require('../controller/link-controller');
      
    apiRoutes.route('/start')
    .post(linkCrawler);

    return apiRoutes
}

module.exports = router;