const { mongoose } = require('../db/mongo');
const User = require('../models/User');
const Item = require('../models/Item');
const Material = require('../models/Material');
const Order = require('../models/Order');


const configController = {
    install: async (req, res) => {
        try {
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Não foi possível conectar ao MongoDB');
            }

            await User.deleteMany({});
            await Item.deleteMany({});
            await Material.deleteMany({});
            await Order.deleteMany({});

            const admin = new User({
                username: 'admin',
                email: 'admin@example.com',
                password: "adm123",
                isAdmin: true
            });
            await admin.save();

            const materials = [
                {name: 'PLA', type: 'Filamento', color: 'Branco', price: 100, stock: 1000},
                {name: 'ABS', type: 'Filamento', color: 'Preto', price: 120, stock: 800},
                {name: 'PETG', type: 'Filamento', color: 'Transparente', price: 150, stock: 600},
                {name: 'TPU', type: 'Filamento', color: 'Vermelho', price: 200, stock: 400},
                {name: 'Nylon', type: 'Filamento', color: 'Azul', price: 250, stock: 300}
            ];
            const createdMaterials = await Material.insertMany(materials);

            const items = [
                {
                    name: 'Cubo',
                    description: 'Cubo simples',
                    price: 10,
                    materials: [createdMaterials[0]._id],
                    dimensions: {x: 10, y: 10, z: 10},
                    weight: 50,
                    printTime: 60
                },
                {
                    name: 'Esfera',
                    description: 'Esfera decorativa',
                    price: 15,
                    materials: [createdMaterials[1]._id],
                    dimensions: {x: 8, y: 8, z: 8},
                    weight: 40,
                    printTime: 90
                },
                {
                    name: 'Vaso',
                    description: 'Vaso para plantas',
                    price: 25,
                    materials: [createdMaterials[2]._id],
                    dimensions: {x: 15, y: 15, z: 20},
                    weight: 100,
                    printTime: 180
                },
                {
                    name: 'Chaveiro',
                    description: 'Chaveiro personalizado',
                    price: 5,
                    materials: [createdMaterials[3]._id],
                    dimensions: {x: 5, y: 2, z: 1},
                    weight: 10,
                    printTime: 30
                },
                {
                    name: 'Suporte de celular',
                    description: 'Suporte para celular',
                    price: 20,
                    materials: [createdMaterials[4]._id],
                    dimensions: {x: 10, y: 5, z: 8},
                    weight: 60,
                    printTime: 120
                }
            ];
            const createdItems = await Item.insertMany(items);

            const users = [
                {username: 'user1', email: 'user1@example.com', password: 'password1'},
                {username: 'user2', email: 'user2@example.com', password: 'password2'},
                {username: 'user3', email: 'user3@example.com', password: 'password3'},
                {username: 'user4', email: 'user4@example.com', password: 'password4'},
                {username: 'user5', email: 'user5@example.com', password: 'password5'}
            ];
            const createdUsers = await User.insertMany(users);

            const orders = [
                {
                    user: createdUsers[0]._id,
                    items: [{item: createdItems[0]._id, quantity: 2}],
                    totalPrice: 20,
                    status: 'pending'
                },
                {
                    user: createdUsers[1]._id,
                    items: [{item: createdItems[1]._id, quantity: 1}, {item: createdItems[2]._id, quantity: 1}],
                    totalPrice: 40,
                    status: 'processing'
                },
                {
                    user: createdUsers[2]._id,
                    items: [{item: createdItems[3]._id, quantity: 3}],
                    totalPrice: 15,
                    status: 'shipped'
                },
                {
                    user: createdUsers[3]._id,
                    items: [{item: createdItems[4]._id, quantity: 1}],
                    totalPrice: 20,
                    status: 'delivered'
                },
                {
                    user: createdUsers[4]._id,
                    items: [{item: createdItems[0]._id, quantity: 1}, {item: createdItems[2]._id, quantity: 2}],
                    totalPrice: 60,
                    status: 'pending'
                }
            ];
            await Order.insertMany(orders);

            res.status(200).json({message: 'Instalação concluída com sucesso!'});
        } catch (error) {
            console.error('Erro durante a instalação:', error);
            res.status(500).json({message: 'Erro durante a instalação', error: error.message});
        }
    }
}

module.exports = configController;