const User = require('../Models/user');

const userController = {
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const reqUser = await User.findOne({ username: req.user });

            if (!reqUser) {
                return res.status(404).json({ message: 'usuario informado nao encontrado' });
            }

            const uptUser = await User.findById(id);

            if (!uptUser) {
                return res.status(404).json({ message: 'usuario informado nao encontrado' });
            }

            if (!reqUser.isAdmin && reqUser.username !== uptUser.username) {
                return res.status(403).json({ message: 'sem permissão para atualizar usuario' });
            }

            if (!reqUser.isAdmin && data.hasOwnProperty('isAdmin')) {
                delete data.isAdmin;
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });

            res.json({ message: 'usuario atualizado', user: updatedUser });
        } catch (error) {
            console.error('erro atualizando usuario:', error);
            res.status(500).json({ message: 'erro interno', error: error.message });
        }
    },
    listUser: async (req, res) => {
        try {
            const reqUser = await User.findOne({ username: req.user });

            if (!reqUser || !reqUser.isAdmin) {
                return res.status(403).json({ message: 'acesso negado' });
            }

            const users = await User.find({});
            res.json(users);
        } catch (error) {
            console.error('erro:', error);
            res.status(500).json({ message: 'erro interno', error: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const reqUser = await User.findOne({ username: req.user });

            if (!reqUser || !reqUser.isAdmin) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const { id } = req.params;
            const userToDelete = await User.findById(id);

            if (!userToDelete) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            await User.findByIdAndDelete(id);
            res.json({ message: 'Usuário deletado com sucesso.' });
        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({ message: 'Erro interno', error: error.message });
        }
    },
    createAdmin: async (req, res) => {
        try {
            const reqUser = await User.findOne({ username: req.user });

            if (!reqUser || !reqUser.isAdmin) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const { username, password, email } = req.body;

            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Username, password e email são obrigatórios.' });
            }

            const newAdmin = new User({
                username,
                password,
                email,
                isAdmin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await newAdmin.save();
            res.status(201).json({ message: 'Administrador criado com sucesso', admin: newAdmin });
        } catch (error) {
            console.error('Erro :', error);
            res.status(500).json({ message: 'Erro interno', error: error.message });
        }
    },
    promoteUser: async (req, res) => {
        try {
            const reqUser = await User.findOne({ username: req.user });

            if (!reqUser || !reqUser.isAdmin) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const { id } = req.params;
            const userToPromote = await User.findById(id);

            if (!userToPromote) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            userToPromote.isAdmin = true;
            userToPromote.updatedAt = new Date();
            await userToPromote.save();

            res.json({ message: 'Usuário promovido a administrador com sucesso', user: userToPromote });
        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({ message: 'Erro interno', error: error.message });
        }
    }

};

module.exports = userController;