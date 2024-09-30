const Order_Client = require('../models/Order_ClientModels')

exports.createNewOrderClient = async (req, res) => {
        try {
            // const { total_quantity, total_price } = req.body;
            // const client_id = req.body.client_id; // client_id req.body'dan olinadi
             
            // Yangi buyurtma yaratish
            const newOrder = await Order_Client.query().insert({
                // turkum: req.body.turkum, // Agar sizda mavjud bo'lsa
                client_id: req.body.client_id,
                total_quantity: req.body.total_quantity,
                total_price: req.body.total_price,
            });
    
            res.status(201).json(newOrder);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }



