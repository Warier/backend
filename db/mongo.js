const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

const DB_URI = process.env.DB_URI;
console.log(__dirname);
console.log(DB_URI);


mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

module.exports = {
    mongoose
};