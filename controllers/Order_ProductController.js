const Order_Product = require('../models/Order_ProductModels')


exports.createNewOrderProduct = async (req, res) => {
    try {
       
        // Yangi buyurtma yaratish
        const newOrder = await Order_Product.query().insert({
            order_client_id: req.params.id,
            product_id: req.body.product_id,
            quantity: req.body.quantity,
            price: req.body.price,
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

