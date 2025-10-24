const UserService = require('../services/UserService');

class UserController {
    async getUser(req, res) {
        try {
            // req.user.id vient du middleware verifyToken
            const user = await UserService.getUser(req.user.id);
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Une erreur est survenue" });
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updatedUser = await UserService.updateUser(userId, req.body);
            res.status(200).json({ msg: "Utilisateur mis à jour avec succès", user: updatedUser });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Une erreur est survenue" });
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const result = await UserService.deleteUser(userId);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Une erreur est survenue" });
        }
    }


    async confirmationCompte(req, res) {
        try {
            const {id} = req.params;
            const user = await UserService.confirmationCompte(id);
            res.status(200).json({ msg: "Compte confirmé avec succès", user });
        } catch (error) {
            console.error(error);
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Une erreur est survenue" });
        }
    }

    async createUser(req, res) {
        try {
            const newUser = await UserService.createUser(req.body);
            res.status(201).json({ msg: "Utilisateur créé avec succès", user: newUser });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Une erreur est survenue" });
        }
    }
}

module.exports = new UserController();