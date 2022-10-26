const siteRoute = require('./site.route');
const apiRoute = require('./api.route');

function Route(app) {
    app.use('/api/product', apiRoute);
    app.use('/', siteRoute);
}

module.exports = Route;