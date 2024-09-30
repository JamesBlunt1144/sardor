const Products = require('../models/ProductModels')
const XLSX = require('xlsx')


exports.getAllProduct = async (req,res)=>{
    const knex = await Products.knex()
    const product = await knex.raw(`SELECT p.id , c.name as turkum, p.name , p.price, 
    p.quantity, p.description FROM product as p 
    RIGHT JOIN category as c on p.category_id = c.id`
    )
    return res.json({success: true, product: product[0]})
}

exports.ProdCreate = async (req, res) => {
    try {
        const newProduct = await Products.query().insert({
            // turkum: req.body.turkum, // Agar sizda mavjud bo'lsa
            category_id: req.body.category_id,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.deleteProd = async(req, res)=> {
    await Products.query().where('id', req.params.id).delete()
    return res.status(200).json({massage: "Deleted"})
}

exports.UpdateProd = async(req, res)=> {
    await Products.query().where('id', req.params.id).update(req.body)
    return res.status(201).json({massage: "Yangilandi"})
}

exports.searchProducts = async (req, res) => {
    const { searchTerm } = req.query;

    // Qidiruv uchun parametrni tekshirish
    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            message: 'Iltimos, qidiruv uchun parametr ko\'rsating.'
        });
    }

    try {
        const knex = await Products.knex();
        const products = await knex.raw(`
            SELECT p.id, c.name AS turkum, p.name, p.price, p.quantity, p.description 
            FROM product AS p 
            LEFT JOIN category AS c ON p.category_id = c.id 
            WHERE p.name LIKE ? OR c.name LIKE ?
        `, [`%${searchTerm}%`, `%${searchTerm}%`]); // Qidiruv shartlari

        return res.status(200).json({
            success: true,
            products: products[0] // Qidiruv natijalari
        });
    } catch (error) {
        console.error('Error searching products:', error);
        return res.status(500).json({
            success: false,
            message: 'Mahsulotlarni qidirishda xato yuz berdi.',
            error: error.message
        });
    }
};


exports.exportProductsToExcel = async (req, res) => {
    try {
        const knex = await Products.knex();
        const result = await knex.raw(`
            SELECT p.id, c.name AS turkum, p.name, p.price, p.quantity, p.description 
            FROM product AS p 
            RIGHT JOIN category AS c ON p.category_id = c.id;
        `);
        
        const products = result[0];

        // Excel faylini yaratish
        const worksheet = XLSX.utils.json_to_sheet(products);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Mahsulotlar");

        // Faylni yaratish va uzatish
        const fileName = 'mahsulotlar.xlsx';
        XLSX.writeFile(workbook, fileName);
        
        // Response orqali faylni uzatish
        res.download(fileName, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Faylni yuklab olishda xato yuz berdi.");
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Xatolik yuz berdi" });
    }
};

exports.getOneProduct = async (req, res) => {
    const product = await Products.query().where("id", req.params.id).first();
    return res.json({ success: true, product: product });
};