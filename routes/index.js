const routes = (packages) => {
    const linkRouter = require('./link-routes')(packages);
    packages.app.use('/crawler', linkRouter);
}

module.exports = routes;