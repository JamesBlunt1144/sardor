const router = require('express').Router()
const Order_ProductController = require('../controllers/Order_ProductController')



router.post('/order/:id', Order_ProductController.createNewOrderProduct)







module.exports = router