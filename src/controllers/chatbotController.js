const request = require('request');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

const postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};
const getWebHook = (req, res) => {
    const VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            // Respond with the challenge token from the request

            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}
// Handles messages events
async function handleMessage(sender_psid, received_message) {
    let response;
    let message;
    const items = ['How are you?', 'I hope you are doing well.', 'I hope you are having a great day.']
    var responses = items[Math.floor(Math.random() * items.length)];
    // Check if the message contains text
    if (received_message.text.toLowerCase() === "hi") {
        console.log("Testing", received_message.text.toLowerCase().includes('/desc'))
        // Create the payload for a basic text message

        response = {
            "text": responses
        }
    } else if (received_message.text.toLowerCase().includes('/desc')) {
        const getProductId = received_message.text.split(" ");
        console.log("PROD ID", getProductId)
        const { connection } = mongoose
        if (getProductId[1]) {
            const collection = connection.db.collection('Products');
            const data = await collection.find({ sku: Number(getProductId[1]) }).toArray();
            message = data[0].description
        } else {
            message = "please Enter Product ID"
        }
        response = {
            "text": message
        }
    } else if (received_message.text.toLowerCase().includes('/price')) {
        if (getProductId[1]) {
            const getProductId = received_message.text.split(" ");
            console.log("PROD ID", getProductId)
            const { connection } = mongoose
            const collection = connection.db.collection('Products');
            const data = await collection.find({ sku: Number(getProductId[1]) }).toArray();
            message = data[0].price
        } else {
            message = "please Enter Product ID"
        }
        response = {
            "text": message
        }
    } else if (received_message.text.toLowerCase().includes('/shipping')) {
        if (getProductId[1]) {
            const getProductId = received_message.text.split(" ");
            console.log("PROD ID", getProductId)
            const { connection } = mongoose
            const collection = connection.db.collection('Products');
            const data = await collection.find({ sku: Number(getProductId[1]) }).toArray();
            message = data[0].shipping
        } else {
            message = "please Enter Product ID"
        }
        response = {
            "text": message
        }
    } else if (received_message.text.toLowerCase().includes('/buy')) {
        if (getProductId[1]) {
            const getProductId = received_message.text.split(" ");
            const { connection } = mongoose
            const collection = connection.db.collection('Products');
            const data = await collection.find({ sku: Number(getProductId[1]) }).toArray();
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMEMAIL,
                    pass: process.env.GMPASS,
                },
            });

            let mailOptions = {
                from: 'sheheryarkhan1992@gmail.com',
                to: "sheheryarkhan1992@hotmail.com",
                subject: `The subject goes here`,
                html: `<body><h1>You Received an order</h1>
            <p>Product ID: ${data[0].sku}</p>
            <p>Price: ${data[0].price}</p>
            <p>Shipping fee: ${data[0].shipping}</p>
            <p>Description: ${data[0].description}</p>
            </body>`,
            };

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(info);
                }
            });
            response = {
                "text": "Order Placed"
            }
        } else {
            response = {
                "text": "please Enter Product ID"
            }
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
            console.log(`My message ${response}`)
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
async function dbTest(req, res) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMEMAIL,
            pass: process.env.GMPASS,
        },
    });

    let mailOptions = {
        from: 'sheheryarkhan1992@gmail.com',
        to: "sheheryarkhan1992@hotmail.com",
        subject: `The subject goes here`,
        html: `The body of the email goes here in HTML`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            res.json(err);
        } else {
            res.json(info);
        }
    });
}
module.exports = {
    postWebhook: postWebhook,
    getWebHook: getWebHook,
    dbTest: dbTest
}