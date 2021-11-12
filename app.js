// Import express
const express = require('express')

// Get the express object going
const app = express()

//
// Import dotenv to configure & import env variables
//
require('dotenv').config()

//
// Configure stripe obj with sk_test key
//
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY)

//
// Probably should move this to the env as well 🤔
//
const PORT = 3000

//
//
// function (message signature, message body) => returns event object or null
//
// Accepts signature to cross check message origin & authenticity with ENDPOINT_SECRET
// Accepts the message body 
//
// If signature verification fails: returns null
// If signature verification passes: returns constructed event obj
//
//
const parseEvent = (signature,body) => {
    try {
        return stripe.webhooks.constructEvent(body,signature,process.env.ENDPOINT_SECRET)
    } catch (err) {
        return null;
    }
}

//
// Webhook POST route
//
// Triggered by API sending a notification when an / any event occours
// Calls parseEvent(...) to construct event obj
// 
// Success: sends 200 with no body
// Failure: sends 400 with error message
//
app.post("/stripe_event",express.raw({ type: 'application/json' }),(req,res) => {
    
    const signature = req.headers['stripe-signature']
    let event = parseEvent(signature,req.body)

    event ? logNsend(res,event) : res.status(400).send(`Webhook Error: ${err.message}`)
})

//
// function (response obj, event obj) => returns undefined (implicit return)
// It is used to log event type before sending an empty response with 200 status.
//
const logNsend = (res,event) => {
    console.log(event.type)
    res.send()
}

//
// Gets the server going
//
app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`)
})