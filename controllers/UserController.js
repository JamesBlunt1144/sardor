const Users = require('../models/UserModels')
const bcrypto = require('bcryptjs')
const { batchInsert } = require('../settings/db')
const jwt = require('jsonwebtoken')
const secret = require('../config/config')
const nodemailer = require('nodemailer')


exports.auth = async (req, res) => {
    try {
        // 1. Foydalanuvchi login bo'yicha bazadan topiladi
        const user = await Users.query().findOne("login", req.body.login);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, err: "user-not-found" });
        }

        // 2. Parolni tekshirish (asinxron usulda)
        const checkPassword = await bcrypto.compare(
            req.body.password,
            user.password
        );
        if (!checkPassword) {
            return res
                .status(400)
                .json({ success: false, err: "login-or-password-fail" });
        }

        // 3. JWT token yaratish
        const payload = { id: user.id };
        const token = await jwt.sign(payload, secret, { expiresIn: "1d" });

        // 4. Muvaffaqiyatli javob qaytarish
        return res.status(200).json({ success: true, token: token });
    } catch (err) {
        // Umumiy xatoliklarni ushlash
        return res
            .status(500)
            .json({
                success: false,
                err: "server-error",
                message: err.message,
            });
    }
};



exports.getHome = (req, res) => {
    return res.json({ success: true, msg: "Foydalanuvchi yaratish" });
};

exports.getOneUser = async (req, res) => {
    const user = await Users.query().where("id", req.params.id).first();
    return res.json({ success: true, user: user });
};

exports.getAllUsers = async (req, res) => {
    console.log(1);
    const user = await Users.query().select("*");
    console.log(user);
    return res.status(200).json({ success: true, user: user });
};

// Ma'lumotni yangilash
exports.put = async (req, res) => {
    await Users.query().findOne("id", req.params.id).update(req.body);
    return res.status(201).json({ success: true }); // Yangilangan ma'lumotni qaytarish
};

  
exports.delete = async(req, res)=> {
    await Users.query().where('id', req.params.id).delete()
    return res.status(200).json({massage: "Deleted"})
}



// Email yuborish uchun konfiguratsiya

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'James.blunt.1144@gmail.com',
        pass: '997531144' // Gmail parolingiz yoki app password
    }
});

// Tasdiqlash kodi yaratish
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 raqamli tasdiqlash kodi
};

// Email yuborish funksiyasi
const sendVerificationEmail = async (toEmail, verificationCode) => {
    const mailOptions = {
        from: 'James.blunt.1144@gmail.com',
        to: toEmail,
        subject: 'Email Tasdiqlash Kodingiz',
        text: `Sizning tasdiqlash kodiz: ${verificationCode}. Iltimos, bu kodni ro'yxatdan o'tishda kiriting.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email yuborildi:', toEmail);
    } catch (error) {
        console.error('Email yuborishda xato:', error);
    }
};

exports.register = async (req, res) => {
    try {
        const { name, birthday, passport_series, phone_number, login, password, email } = req.body;

        const existingUser = await Users.query().where('login', login).first();
        if (existingUser) {
            return res.status(400).json({ success: false, msg: 'Foydalanuvchi mavjud' });
        }

        // Parolni hash qilish
        const salt = await bcrypto.genSalt(10);
        const hashedPassword = await bcrypto.hash(password, salt);

        const verificationCode = generateVerificationCode();

        await Users.query().insert({    
            name,
            birthday,
            passport_series,
            phone_number,
            login,
            password: hashedPassword,
            email,
            verification_code: verificationCode,
            is_verified: false
        });

        await sendVerificationEmail(email, verificationCode);

        return res.status(201).json({ success: true, msg: 'Ro\'yxatdan o\'tdingiz. Tasdiqlash kodi email orqali yuborildi.' });
    } catch (error) {
        console.error('Xato:', error);
        return res.status(500).json({ success: false, msg: 'Serverda xato yuz berdi' });
    }
};
