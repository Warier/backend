const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;

const authController = {
    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });

            if (user && user.password === password) {
                const token = jwt.sign({ username }, JWT_KEY, { expiresIn: '10 min' });
                res.json({ logged: true, token: token, usuario: username });
            } else {
                res.status(403).json({ logged: false, message: 'usuario ou senha errados' });
            }
        } catch (err) {
            console.error('erro de login:', err);
            res.status(500).json({ message: 'erro intenro' });
        }
    },

    validateAccess: (req, res, next) => {
        let bearToken = req.headers['authorization'] || "";
        let token = bearToken.split(" ");
        if (token[0] == 'Bearer') {
            token = token[1];
        }

        jwt.verify(token, JWT_KEY, (err, obj) => {
            if (err) {
                res.status(403).json({ message: "token invalido" });
            } else {
                req.user = obj.username;
                next();
            }
        });
    },
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ message: 'Username, email e password são obrigatórios.' });
            }

            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Username ou email já estão em uso.' });
            }

            const newUser = new User({
                username,
                email,
                password,
                isAdmin: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await newUser.save();
            res.status(201).json({
                message: 'Usuário criado com sucesso',
                userId: newUser._id,
                info: 'É necessário fazer login para receber o token de acesso com o username e a senha'
            });
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            res.status(500).json({ message: 'Erro interno', error: error.message });
        }
    }
};

module.exports = authController;