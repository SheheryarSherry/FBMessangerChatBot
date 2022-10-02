require('dotenv').config()
const express = require('express');
const viewEngine = require('./config/viewEngine');
const initWebRoutes = require('./routes/web');
const bodyParser = require('body-parser');

let app = express();

//config view 
viewEngine(app);

//use body-parser to post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//initiate all web routes
initWebRoutes(app);

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is runnig at port ${port}`);

})