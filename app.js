const express = require('express')
const app = express()
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_TEST_KEY)

const PORT = 3000

app.post(
    "/stripe_checkout",
    express.raw({ 
        type: 'application/json'
    }),(req,res) => {
        const sig = req.headers['stripe-signature']

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body,sig,process.env.ENDPOINT_SECRET)
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`)
            return;
        }

        console.log(event.type)
        
        res.send()
    }
)

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`)
})