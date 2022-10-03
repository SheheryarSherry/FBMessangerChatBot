const express = require('express');
const mongoose = require('mongoose');
const { getWebHook, postWebhook, dbTest } = require('../controllers/chatbotController');
const getHomepage = require('../controllers/homepageController');
const router = express.Router();
/*
Config view engine for node app 
*/
const initWebRoutes = (app) => {
    router.get('/', getHomepage.getHomepage);
    router.get('/webhook', getWebHook);
    router.post('/webhook', postWebhook);
    router.get('/products', dbTest);

    return app.use('/', router);
};

module.exports = initWebRoutes;