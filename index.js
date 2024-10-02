const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./router/UserRouter')
const ProductRouter = require('./router/ProductRouter')
const ClientRouter= require ('./router/ClientRouter')
const CategoryRouter = require('./router/CategoryRouter')
const OrdersRouter = require('./router/OrdersRouter')
const Order_ProductRouter = require('./router/Order_ProductRouter')
const Order_ClientRouter = require('./router/Order_ClientRouter')
const cors = require('cors')
const morgan = require('morgan')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors('*'))
app.use(morgan('tiny'))
// parse application/json
app.use(bodyParser.json())

// app.get('/user' , (req,res)=>{
//     res.json({success: true})
// })


app.use('/user', userRouter)

app.use('/product', ProductRouter)

app.use('/clients' , ClientRouter)

app.use('/category', CategoryRouter )

app.use ('/order',OrdersRouter)

app.use ('/OrderProduct', Order_ProductRouter)

app.use ('/OrderClient', Order_ClientRouter)

app.listen(3001, ()=> {
    console.log("Server running")
})


