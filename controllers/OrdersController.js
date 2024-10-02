const Orders = require('../models/OrdersModels')

// Importlar
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// .env faylini yuklash
dotenv.config();

// MySQL ulanish poolini yaratish
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'secret',
    database: process.env.DB_NAME || 'Tiger',
});

// Global korzinka (barcha foydalanuvchilar uchun)
let cart = [];

// Korzinkaga mahsulot qo'shish funksiyasi
exports.createSale = async (req, res) => {
    const { product_id, quantity, price } = req.body;

    // Kiritilgan maydonlarni tekshirish
    if (!product_id || !quantity || !price) {
        return res.status(400).json({ message: `Kerakli maydonlar to'ldirilmagan.` });
    }

    // Korzinkaga mahsulotni qo'shish uchun obyekt yaratish
    const item = {
        product_id,
        quantity,
        price,
        total: quantity * price,
    };

    // Korzinkaga mahsulotni qo'shish
    cart.push(item);
    res.status(201).json({ message: `Mahsulot korzinkaga qo'shildi`, cart });
};

// Korzinkadagi mahsulotlarni ko'rish
exports.viewSale = async (req, res) => {
    res.status(200).json(cart);
};

// Korzinkadagi mahsulotlarni bazaga yozib buyurtma qilish (sotish)
// exports.saleOrder = async (req, res) => {
//     const { client_id } = req.body;

//     // Korzinka bo'sh ekanligini tekshirish
//     if (cart.length === 0) {
//         return res.status(400).json({ message: `Korzinka bo'sh` });
//     }

//     // Unikal 6 xonali buyurtma ID yaratish
//     const order_id = (Math.floor(100000 + Math.random() * 900000)).toString(); // 6 xonali raqam
//     const total_price = cart.reduce((total, item) => total + item.total, 0); // umumiy narx
//     const total_quantity = cart.reduce((total, item) => total + item.quantity, 0); // umumiy miqdor
//     const created_at = new Date(); // hozirgi vaqtni olish

//     let connection;

//     try {
//         // Transactionni boshlash
//         connection = await pool.getConnection();
//         await connection.beginTransaction();

//         // Buyurtmani "orders" jadvaliga yozish
//         const insertOrderQuery = `
//             INSERT INTO orders (order_id, quantity, total_price, client_id, created_at)
//             VALUES (?, ?, ?, ?, ?)
//         `;
//         const [result] = await connection.execute(insertOrderQuery, [order_id, total_quantity, total_price, client_id, created_at]);

//         const orderId = result.insertId; // orders jadvalidagi order_id ni olish

//         // Har bir mahsulotni "order_items" jadvaliga yozish
//         for (let item of cart) {
//             const insertOrderItemQuery = `
//                 INSERT INTO order_items (order_id, product_id, quantity, price)
//                 VALUES (?, ?, ?, ?)
//             `;
//             await connection.execute(insertOrderItemQuery, [orderId, item.product_id, item.quantity, item.price]);
//         }

//         // Transactionni yakunlash
//         await connection.commit();

//         // Korzinkani tozalash
//         cart = [];

//         // Muvaffaqiyatli javob qaytarish
//         res.status(201).json({ message: 'Buyurtma muvaffaqiyatli amalga oshirildi', order_id });
//     } catch (error) {
//         // Xatolik yuz bersa, transactionni bekor qilish
//         console.error(error);
//         if (connection) await connection.rollback();
//         res.status(500).json({ message: 'Buyurtma qilishda xatolik yuz berdi' });
//     } finally {
//         // Connectionni bo'shatish
//         if (connection) connection.release();
//     }
// };

///