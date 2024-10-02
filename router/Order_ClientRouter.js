const router = require('express').Router()
const Order_ClientController = require('../controllers/Order_ClientController')


router.post('/order',Order_ClientController.createNewOrderClient)

router.get('/getAllOrder', Order_ClientController.getAllOrders)


module.exports = router
