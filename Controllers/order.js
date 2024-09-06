const Order = require('../Models/order');
const Item = require('../Models/item');
const User = require('../Models/user');
const Material = require('../Models/material');
const mongoose = require("mongoose");

const orderController = {

    calculateItemPrice: async (item) => {
        const material = await Material.findById(item.materials);
        return material.price * item.weight;
    },

    updateOrderTotalPrice: async (orderId) => {
        const order = await Order.findById(orderId).populate('items.item');
        let totalPrice = 0;
        for (let orderItem of order.items) {
            totalPrice += await orderController.calculateItemPrice(orderItem.item) * orderItem.quantity;
        }
        order.totalPrice = totalPrice;
        await order.save();
    },

    getOrders: async (req, res) => {
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = parseInt(limit);
            page = parseInt(page);

            if (![5, 10, 30].includes(limit)) {
                return res.status(400).json({ message: 'Limite inválido. Use 5, 10 ou 30.' });
            }

            const user = await User.findOne({ username: req.user });
            let orders;
            let totalOrders;

            if (user.isAdmin) {
                totalOrders = await Order.countDocuments();
                orders = await Order.find()
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('items.item');
            } else {
                totalOrders = await Order.countDocuments({ user: user._id });
                orders = await Order.find({ user: user._id })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('items.item');
            }

            res.json({
                orders,
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalItems: totalOrders
            });
        } catch (error) {
            console.error('Erro ao listar orders:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    createOrder: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.user });
            let { items } = req.body;

            // Processar os itens para o formato correto
            items = items.map(item => {
                if (typeof item === 'string') {
                    // Se o item for apenas um ID, assume quantidade 1
                    return { item: item, quantity: 1 };
                } else if (typeof item === 'object' && item.item && item.quantity) {
                    // Se o item já estiver no formato correto, mantenha-o
                    return item;
                } else {
                    throw new Error('Formato de item inválido');
                }
            });

            const newOrder = new Order({
                user: user._id,
                items: items,
                status: 'pending',
                totalPrice: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await newOrder.save();
            await orderController.updateOrderTotalPrice(newOrder._id);

            // Buscar a ordem atualizada para retornar
            const updatedOrder = await Order.findById(newOrder._id).populate('items.item');

            res.status(201).json({ message: 'Order criada com sucesso', order: updatedOrder });
        } catch (error) {
            console.error('Erro ao criar order:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },

    updateOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ username: req.user });
            const order = await Order.findById(id);

            if (!order) {
                return res.status(404).json({ message: 'Order não encontrada' });
            }

            if (!user.isAdmin && order.user.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const updateData = req.body;
            updateData.updatedAt = new Date();

            if (!user.isAdmin) {
                // Usuários normais só podem modificar a lista de itens
                if (updateData.items) {
                    order.items = updateData.items;
                }
            } else {
                // Admins podem modificar todos os campos, exceto os tempos
                Object.assign(order, updateData);
            }

            await order.save();
            await orderController.updateOrderTotalPrice(order._id);

            res.json({ message: 'Order atualizada com sucesso', order });
        } catch (error) {
            console.error('Erro ao atualizar order:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ username: req.user });
            const order = await Order.findById(id);


            if (!order) {
                return res.status(404).json({ message: 'Order não encontrada' });
            }

            if (!user.isAdmin && order.user.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            await Order.findByIdAndDelete(id);
            res.json({ message: 'Order deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar order:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },

    createItem: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.user });
            const { name, description, materials, weight } = req.body;
            const { orderId } = req.params;
            const order = await Order.findById(orderId);

            const newItem = new Item({
                name,
                description,
                materials,
                weight,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log(order);
            newItem.price = await orderController.calculateItemPrice(newItem);
            order.items.push({
                item: newItem,
                quantity: 1
            });
            order.totalPrice = newItem.price
            await order.save();
            await newItem.save();

            res.status(201).json({ message: 'Item criado com sucesso', item: newItem });
        } catch (error) {
            console.error('Erro ao criar item:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },

    updateItem: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ username: req.user });
            const item = await Item.findById(id);

            if (!item) {
                return res.status(404).json({ message: 'Item não encontrado' });
            }

            const updateData = req.body;
            updateData.updatedAt = new Date();

            if (!user.isAdmin) {
                // Usuários normais só podem modificar nome, descrição, material e peso
                ['name', 'description', 'material', 'weight'].forEach(field => {
                    if (updateData[field]) item[field] = updateData[field];
                });
            } else {
                // Admins podem modificar todos os campos
                Object.assign(item, updateData);
            }

            item.price = await orderController.calculateItemPrice(item);
            await item.save();

            // Atualizar preços de todas as orders que contêm este item
            const orders = await Order.find({ 'items.item': item._id });
            for (let order of orders) {
                await orderController.updateOrderTotalPrice(order._id);
            }

            res.json({ message: 'Item atualizado com sucesso', item });
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },

    deleteItem: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.user });
            if (!user.isAdmin) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const { id } = req.params;
            const deletedItem = await Item.findByIdAndDelete(id);
            if (!deletedItem) {
                return res.status(404).json({ message: 'Item não encontrado' });
            }

            // Remover o item de todas as orders
            await Order.updateMany(
                { 'items.item': id },
                { $pull: { items: { item: id } } }
            );

            // Atualizar preços de todas as orders afetadas
            const affectedOrders = await Order.find({ 'items.item': id });
            for (let order of affectedOrders) {
                await orderController.updateOrderTotalPrice(order._id);
            }

            res.json({ message: 'Item deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar item:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },
    getOrderById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ username: req.user });
            const order = await Order.findById(id)
                .populate('user', 'username email')
                .populate({
                    path: 'items.item',
                    populate: {
                        path: 'material',
                        select: 'name type color price'
                    }
                });

            if (!order) {
                return res.status(404).json({ message: 'Order não encontrada' });
            }

            if (!user.isAdmin && order.user._id.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            res.json(order);
        } catch (error) {
            console.error('Erro ao buscar order:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    }
};

module.exports = orderController;