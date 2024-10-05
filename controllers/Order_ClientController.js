const Order_Client = require('../models/Order_ClientModels')
const Order_Product = require('../models/Order_ProductModels')
const Product = require('../models/ProductModels')

// Barcha buyurtmalarni olish
exports.getAllOrders = async(req,res)=> {
    try {
        const knex = await Order_Client.knex();
        const getAllOrders = await knex.raw(`SELECT * FROM order_client WHERE 1`);

        return res.json({ success: true, getAllOrders: getAllOrders[0] });
    } catch (error) {
        console.error('Error fetching clients:', error); // Xatoni konsolga chiqarish
        return res.status(500).json({ success: false, message: 'Buyurtmalarni olishda xatolik yuz berdi.' });
    }
}; 

// Buyurtma yaratish
// exports.createNewOrderClient = async (req, res) => {
//     try {
//         // Yangi buyurtma yaratish
//         const orderClient = await Order_Client.query().insert({
//             client_id: req.body.client_id,
//             status: 0, // Dastlabki status 0
//             create_at: new Date() // Hozirgi vaqtni qo'shish
//         });

//         let total_summ = 0;
//         let total_quantity = 0;
//         let allProductsAvailable = true; // Mahsulotlar mavjudligini tekshirish

//         // Mahsulotlar bilan bog‘liq buyurtma mahsulotlarini qo‘shish
//         for (const element of req.body.products) {
//             const product = await Product.query().findById(element.product_id);

//             if (!product || product.quantity < element.quantity) {
//                 allProductsAvailable = false; // Mahsulotlar yetarli emas
//                 break;
//             }

//             const totalPrice = product.price * element.quantity;

//             await Order_Product.query().insert({
//                 order_client_id: orderClient.id,
//                 product_id: element.product_id,
//                 quantity: element.quantity,
//                 price: product.price,
//                 total_price: totalPrice
//             });

//             // Mahsulot miqdorini kamaytirish
//             await Product.query().findById(element.product_id).patch({
//                 quantity: product.quantity - element.quantity
//             });

//             // Jamlangan summani va miqdorni yangilash
//             total_summ += totalPrice;
//             total_quantity += element.quantity;
//         }

//         // Buyurtma ma'lumotlarini yangilash
//         if (allProductsAvailable) {
//             await Order_Client.query().findById(orderClient.id).patch({
//                 total_quantity: total_quantity,
//                 total_price: total_summ,
//                 status: 1 // Agar buyurtma oxiriga yetkazilsa status 1
//             });
//             res.status(201).json({ success: true });
//         } else {
//             await Order_Client.query().findById(orderClient.id).patch({
//                 status: 0 // Agar buyurtma oxiriga yetmay qolsa status 0
//             });
//             res.status(400).json({ success: false, message: 'Mahsulotlar yetarli emas' });
//         }
//     } catch (error) {
//         console.error(error); // Xatolikni konsolga chiqarish
//         res.status(500).json({ error: error.message });
//     }
// };

// Buyurtmani bekor qilish
exports.cancelOrderClient = async (req, res) => {
    try {
        const orderClientId = req.params.id;
        const orderProducts = await Order_Product.query().where('order_client_id', orderClientId);

        // Agar buyurtma mahsulotlari bo'lmasa, xatolik qaytarish
        if (!orderProducts.length) {
            return res.status(404).json({ success: false, msg: 'Buyurtma mahsulotlari topilmadi' });
        }

        const orderClient = await Order_Client.query().findById(orderClientId);
        if (!orderClient) {
            return res.status(404).json({ success: false, msg: 'Buyurtma topilmadi' });
        }

        if (orderClient.Status == 2) {
            return res.status(400).json({ success: false, msg: 'Buyurtma allaqachon bekor qilingan' });
        }

        // Har bir buyurtma mahsulotini qaytarish
        for (const orderProduct of orderProducts) {
            const product = await Product.query().findById(orderProduct.product_id);
            await Product.query().findById(orderProduct.product_id).patch({
                quantity: product.quantity + orderProduct.quantity
            });
        }

        // Buyurtmani bekor qilish
        await Order_Client.query().findById(orderClientId).patch({
            Status: 2 // Status 2 - bekor qilingan
        });

        console.log('Buyurtma bekor qilindi va mahsulotlar qaytarildi.');
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Buyurtma bekor qilishda xatolik yuz berdi' });
    }
};

exports.cancelProduct = async (req, res) => {
    const orderClientId = req.params.id;
    
    try {
        const orderClient = await Order_Client.query().findById(orderClientId);
        if (!orderClient) {
            return res.status(404).json({ success: false, msg: 'Buyurtma topilmadi' });
        }

        if (orderClient.Status == 2) {
            return res.status(400).json({ success: false, msg: 'Buyurtma allaqachon bekor qilingan' });
        }

        await exports.cancelOrderClient(req, res); // req va res ni o'tkazish
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createNewOrderClient = async (req, res) => {
    try {
        let total_summ = 0;
        let total_quantity = 0;
        let allProductsAvailable = true; // Mahsulotlar mavjudligini tekshirish

        // Mahsulotlar bilan bog‘liq buyurtma mahsulotlarini tekshirish
        for (const element of req.body.products) {
            const product = await Product.query().findById(element.product_id);

            if (!product || product.quantity < element.quantity) {
                allProductsAvailable = false; // Mahsulotlar yetarli emas
                break;
            }
        }

        if (!allProductsAvailable) {
            return res.status(400).json({ success: false, message: 'Mahsulotlar yetarli emas' });
        }

        // Yangi buyurtma yaratish
        const orderClient = await Order_Client.query().insert({
            client_id: req.body.client_id,
            status: 0, // Dastlabki status 0
            create_at: new Date() // Hozirgi vaqtni qo'shish
        });

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

            // Mahsulot miqdorini kamaytirish
            await Product.query().findById(element.product_id).patch({
                quantity: product.quantity - element.quantity
            });

            // Jamlangan summani va miqdorni yangilash
            total_summ += totalPrice;
            total_quantity += element.quantity;
        }

        // Buyurtma ma'lumotlarini yangilash
        await Order_Client.query().findById(orderClient.id).patch({
            total_quantity: total_quantity,
            total_price: total_summ,
            status: 1 // Agar buyurtma oxiriga yetkazilsa status 1
        });

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error); // Xatolikni konsolga chiqarish
        res.status(500).json({ error: error.message });
    }
};


// Order mahsulotlarini olish funksiyasi
exports.getOrderProducts = async (req, res) => {
    const { order_client_id } = req.params;
    try {
        const orderProducts = await Order_Product.query().where({ order_client_id });
        
        if (orderProducts.length === 0) {
            return res.status(404).json({ success: false, message: 'Buyurtma mahsulotlari topilmadi' });
        }
        
        res.status(200).json(orderProducts);
    } catch (error) {
        console.error('Error fetching order products:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mijozlarni F.I.SH bo'yicha qidirish funksiyasi
exports.getClientsByName = async (req, res) => {
    const { searchTerm } = req.params; // F.I.SH yoki uning bir qismini olish

    try {
        // Mijozlarni ism bo'yicha qidirish
        const clients = await Client.query()
            .where('first_name', 'like', `%${name}%`)
            .orWhere('last_name', 'like', `%${name}%`)
            .orWhere('middle_name', 'like', `%${name}%`);
        
        // Agar mijozlar topilmasa
        if (clients.length === 0) {
            return res.status(404).json({ success: false, message: 'Mijozlar topilmadi' });
        }

        // Topilgan mijozlarni qaytarish
        res.status(200).json({ success: true, clients });
    } catch (error) {
        console.error('Error fetching clients by name:', error);
        res.status(500).json({ error: error.message });
    }
};


