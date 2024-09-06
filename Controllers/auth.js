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
                res.status(403).json({ logged: false, message: 'Invalid username or password' });
            }
        } catch (err) {
            console.error('Error during login:', err);
            res.status(500).json({ message: 'Internal server error' });
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
                res.status(403).json({ message: "Invalid token, access denied" });
            } else {
                req.user = obj.username; // Store the discovered user in the req object
                next();
            }
        });
    }
};

module.exports = authController;