const Material = require('../Models/material');
const Order = require('../Models/order');
const Item = require('../Models/item');
const User = require('../Models/user');

const materialController = {

    getAllMaterials: async (req, res) => {
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = parseInt(limit);
            page = parseInt(page);

            if (![5, 10, 30].includes(limit)) {
                return res.status(400).json({ message: 'Limite inválido. Use 5, 10 ou 30.' });
            }

            const totalMaterials = await Material.countDocuments();
            const materials = await Material.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            res.json({
                materials,
                currentPage: page,
                totalPages: Math.ceil(totalMaterials / limit),
                totalItems: totalMaterials
            });
        } catch (error) {
            console.error('Erro ao listar materiais:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    createMaterial: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.user });
            if (!user || !user.isAdmin) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const { name, type, color, price, stock } = req.body;
            const newMaterial = new Material({
                name,
                type,
                color,
                price,
                stock,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await newMaterial.save();
            res.status(201).json({ message: 'Material criado com sucesso', material: newMaterial });
        } catch (error) {
            console.error('Erro ao criar material:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },

    updateMaterial: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.user });
            if (!user || !user.isAdmin) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const { id } = req.params;
            const updateData = req.body;
            updateData.updatedAt = new Date();

            const updatedMaterial = await Material.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!updatedMaterial) {
                return res.status(404).json({ message: 'Material não encontrado' });
            }

            res.json({ message: 'Material atualizado com sucesso', material: updatedMaterial });
        } catch (error) {
            console.error('Erro ao atualizar material:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },

    deleteMaterial: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.user });
            if (!user || !user.isAdmin) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const { id } = req.params;
            const deletedMaterial = await Material.findByIdAndDelete(id);
            if (!deletedMaterial) {
                return res.status(404).json({ message: 'Material não encontrado' });
            }

            res.json({ message: 'Material deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar material:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },
    listMaterialsUsed: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.user });
            if (!user) {
                return res.status(404).json({ message: 'usuario nao encontrado' });
            }

            const userOrders = await Order.find({ user: user._id }).populate({
                path: 'items.item',
                populate: {
                    path: 'materials',
                    model: 'Material'
                }
            });

            let materials = [];
            let uniqueMaterials = {};

            for(const order of userOrders){
                for(const items of order.items) {
                    for (let material of items.item.materials) {
                        if (!uniqueMaterials[material._id]) {
                            uniqueMaterials[material._id] = true;
                            materials.push(material);
                        }
                    }
                }
            }
            res.json({
                materials: materials
            });

        } catch (error) {
            console.error('erro:', error);
            res.status(500).json({ message: 'erro interno', error: error.message });
        }
    }
};

module.exports = materialController;