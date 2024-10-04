const router = require('express').Router()

const Order_ClientController = require('../controllers/Order_ClientController')


router.post('/order',Order_ClientController.createNewOrderClient)

router.get('/getAllOrder', Order_ClientController.getAllOrders)

router.post('/cancel', Order_ClientController.cancelOrderClient)

router.delete('/cancelProduct/:id', Order_ClientController.cancelProduct)

router.get('/getOrder/:order_client_id',Order_ClientController.getOrderProducts)

module.exports = router
