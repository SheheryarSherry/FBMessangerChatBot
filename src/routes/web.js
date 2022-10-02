const express = require('express');
const getHomepage = require('../controllers/homepageController');
let router = express.Router();
/*
Config view engine for node app 
*/

let initWebRoutes = (app) => {
    router.get('/', getHomepage.getHomepage);
    return app.use('/', router);
};

module.exports = initWebRoutes;