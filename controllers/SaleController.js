const Sales = require('../models/SaleModels');


exports.createNewSale = async (req, res) => {
    const { product_id, quantity , client_id } = req.body;

    // Kiruvchi ma'lumotlarni tekshirish
    if (!product_id || !quantity || !client_id) {
        return res.status(400).json({ success: false, message: "Zarur maydonlar etishmayapti." });
    }

    // Quantity manfiy emasligini tekshirish
    if (quantity <= 0) {
        return res.status(400).json({ success: false, message: "Quantity manfiy yoki nol bo'lishi mumkin emas." });
    }

    try {
        const knex = await Sales.knex();
        
        // Mahsulot ma'lumotlarini olish
        const product = await knex('product').select('price', 'quantity').where('id', product_id).first();
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Mahsulot topilmadi." });
        }

        // Narx va mavjud zaxirani tekshirish
        if (product.price <= 0) {
            return res.status(400).json({ success: false, message: "Noto'g'ri mahsulot narxi." });
        }
        if (product.quantity < quantity) {
            return res.status(400).json({ success: false, message: "Mavjud zaxira etarli emas." });
        }

        const totalPrice = product.price * quantity; // Jami narxni hisoblash

        // Yangi sotuvni qo'shish
        await knex('sales').insert({
            product_id,
            quantity,
            client_id,
            price: totalPrice // Jami narxni saqlash
        });

        // Mahsulot sonini yangilash
        await knex('product').where('id', product_id).decrement('quantity', quantity);

        return res.json({ success: true, message: "Sotuv muvaffaqiyatli qayd etildi." });
    } catch (error) {
        console.error("Sotuvni yaratishda xato:", error);
        return res.status(500).json({ success: false, message: "Sotuvni yaratishda xato." });
    }
};


exports.getSalesHistory = async (req, res) => {
    try {
        const knex = await Sales.knex();
        const salesHistory = await knex.raw(`
            SELECT * FROM sales 
        `);

        return res.json({ success: true, salesHistory: salesHistory[0] });
    } catch (error) {
        console.error("Error fetching sales history:", error);
        return res.status(500).json({ success: false, message: "Error fetching sales history." });
    }
};


exports.getAllSalesForToday = async (req, res) => {
    try {
        const knex = await Sales.knex();
        
        // Bugungi sanani olish
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Bugun sotilgan mahsulotlarni olish
        const sales = await knex('sales')
            .select('product_id', 'quantity', 'price', 'client_id', 'Status', 'sale_date')
            .where('sale_date', '>=', startOfDay)
            .andWhere('sale_date', '<=', endOfDay);

        if (sales.length === 0) {
            return res.json({ success: true, message: "Bugun sotilgan mahsulotlar mavjud emas.", sales: [] });
        }

        return res.json({ success: true, sales });
    } catch (error) {
        console.error("Sotuvlarni olishda xato:", error.message, error.stack);
        return res.status(500).json({ success: false, message: "Sotuvlarni olishda xato." });
    }
};




