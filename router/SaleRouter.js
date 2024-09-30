const router = require('express').Router()
const SaleController = require('../controllers/SaleController')


router.post('/newsale', SaleController.createNewSale)

router.get('/history', SaleController.getSalesHistory)

router.get('/getSelaForToday', SaleController.getAllSalesForToday)

module.exports = router