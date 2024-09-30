const Clients = require('../models/ClientModels')

// Ma'lumotni olish    
exports.getAllClients = async (req, res) => {
    try {
        const knex = await Clients.knex();
        const getAllClients = await knex.raw(`SELECT id, Nick_name, Full_name, Passport, Date_of_birth, 
        Sex, Phone_num1, Phone_num2, Adress, DATE(created) as created FROM client`);

        return res.json({ success: true, getAllClients: getAllClients[0] });
    } catch (error) {
        console.error('Error fetching clients:', error); // Xatoni konsolga chiqarish
        return res.status(500).json({ success: false, message: 'Mijozlarni olishda xato yuz berdi.' });
    }
};

// Ma'lumotni yaratish
exports.ClientCreate = async (req, res) => {
    try {
        const newClient = await Clients.query().insert({
            Nick_name: req.body.Nick_name,
            Full_name: req.body.Full_name,
            Passport: req.body.Passport,
            Date_of_birth: req.body.Date_of_birth,
            Sex: req.body.Sex,
            Phone_num1: req.body.Phone_num1,
            Phone_num2: req.body.Phone_num2,
            Adress: req.body.Adress,
            created: req.body.created
        });

        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Ma'lumotni yangilash
exports.update = async (req, res) => {
    await Clients.query().findOne('id',req.params.id).update(req.body) 
    return res.status(201).json({success:true}) // Yangilangan ma'lumotni qaytarish
} 


// Ma'lumotni o`chirish
exports.delete = async(req, res)=> {
    await Clients.query().where('id', req.params.id).delete()
    return res.status(200).json({massage: "Deleted"})
}

// Ma'lumotni qidirish
//  http://localhost:3001/clients/search?searchTerm=2395895
exports.searchClients = async (req, res) => {
    const { searchTerm } = req.query;

    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            message: 'Qidiruv uchun parametr ko\'rsatilmagan.'
        });
    }

    try {
        const knex = await Clients.knex();
        const result = await knex.raw(`
            SELECT id, Nick_name, Full_name, Passport, Date_of_birth, 
                   Sex, Phone_num1, Phone_num2, Adress, DATE(created) as created 
            FROM client 
            WHERE Full_name LIKE ? OR Passport LIKE ? OR Phone_num1 LIKE ? OR Phone_num2 LIKE ?
        `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]); // LIKE operatoridan foydalanish

        return res.status(200).json({
            success: true,
            clients: result[0]
        });
    } catch (error) {
        console.error('Error searching clients:', error);
        return res.status(500).json({
            success: false,
            message: 'Mijozlarni qidirishda xato yuz berdi.',
            error: error.message
        });
    }
};


// Ma'lumotni vaqt oraliqi bo`yicha filtrlash
//  http://localhost:3001/clients/filterByDate?startDate=2024-09-20&endDate=2024-09-21
exports.filterClientsByDate = async (req, res) => {
    const { startDate, endDate } = req.query;

    // Sanalar kiritilganligini tekshirish
    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: 'Iltimos, startDate va endDate parametrlarini ko\'rsating.'
        });
    }

    try {
        const knex = await Clients.knex();
        const result = await knex.raw(`
            SELECT id, Nick_name, Full_name, Passport, Date_of_birth, 
                   Sex, Phone_num1, Phone_num2, Adress, DATE_FORMAT(created, '%d/%m/%Y') as created 
            FROM client 
            WHERE created BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        `, [startDate, endDate]); // EndDate'ga 1 kun qo'shish

        return res.status(200).json({
            success: true,
            clients: result[0]
        });
    } catch (error) {
        console.error('Error filtering clients by date:', error);
        return res.status(500).json({
            success: false,
            message: 'Mijozlarni sanaga ko\'ra filtrlashda xato yuz berdi.',
            error: error.message
        });
    }
};






