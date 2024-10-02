const Order_Client = require('../models/Order_ClientModels')
const Order_Product = require('../models/Order_ProductModels')
const Product = require('../models/ProductModels')


// exports.createNewOrderClient = async (req, res) => {
//     try {
//         await Order_Client.query().insert({
//             client_id: req.body.client_id
//         }).then(async (item) => {
//             req.body.products.forEach(async (element) => {
//                 const product = await Product.query().findOne('id', element.product_id)
//                 await Order_Product.query().insert({
//                     order_client_id: item.id,
//                     product_id: element.product_id,
//                     quantity: element.quantity,
//                     price: product.price,
//                     total_price: product.price * element.quantity
//                 })
//             });

//             let total_summ = 0
//             total_quantity = 0

//             const OrderProduct = await Order_Product.query().where('order_client_id', item.id)
//             OrderProduct.forEach((item) => {
//                 total_summ = + item.total_price
//                 total_quantity = + item.quantity
//             })
//             await Order_Client.query().findOne('id', item.id).update({ total_quantity: total_quantity, total_price: total_summ })
//         })


//         res.status(201).json({ success: true });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


exports.createNewOrderClient = async (req, res) => {
    try {
        // Yangi buyurtma yaratish
        const orderClient = await Order_Client.query().insert({
            client_id: req.body.client_id
        });

        let total_summ = 0;
        let total_quantity = 0;

        // Mahsulotlar bilan bog‘liq buyurtma mahsulotlarini qo‘shish
        for (const element of req.body.products) {
            const product = await Product.query().findById(element.product_id);
            const totalPrice = product.price * element.quantity;

            await Order_Product.query().insert({
                order_client_id: orderClient.id,
                product_id: element.product_id,
                quantity: element.quantity,
                price: product.price,
                total_price: totalPrice
            });

            // Jamlangan summani va miqdorni yangilash
            total_summ += totalPrice;
            total_quantity += element.quantity;
        }

        // Buyurtma ma'lumotlarini yangilash
        await Order_Client.query().findById(orderClient.id).patch({
            total_quantity: total_quantity,
            total_price: total_summ
        });

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

