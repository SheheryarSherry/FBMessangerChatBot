require('dotenv').config()
const express = require('express');
const viewEngine = require('./config/viewEngine');
const initWebRoutes = require('./routes/web');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//config view 
viewEngine(app);

//use body-parser to post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//initiate all web routes
initWebRoutes(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is runnig at port ${port}`);
})
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.sivkx.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`);