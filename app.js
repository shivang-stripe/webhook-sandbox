const express = require('express')
const app = express()

const PORT = 3000


app.post(
    "/stripe_checkout",
    express.raw({ 
        type: 'application/json'
    }),(req,res) => {
        const sig = req.headers['stripe-signature']

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body,sig,endpointSecret)
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`)
            return;
        }

        console.log(event.type)

        // switch (event.type) {
        //     case 'payment_intent.succeeded':
        //         const paymentIntent = event.data.object;
        //         console.log(paymentIntent)

        //         break;
        
        //     default:
        //         console.log(`Unhandled event type ${event.type}`)
        //         break;
        // }

        res.send()
    }
)

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`)
})