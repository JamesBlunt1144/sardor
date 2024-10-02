const router = require('express').Router()
const OrdersController = require('../controllers/OrdersController')

// Order yaratish yo'li
router.post('/create', OrdersController.createSale);

// Buyurtmalarni bazaga yozish yo'li
// router.post('/sale', OrdersController.saleOrder);

// Korzinkani ko'rish
router.get('/view', OrdersController.viewSale);

module.exports = router