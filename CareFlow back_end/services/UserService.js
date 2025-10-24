const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserService {
    async getUser(userId) {
        const user = await User.findById(userId).select('-motDePasse');
        if (!user) {
            const error = new Error("Utilisateur non trouvé.");
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    async getAllUsers() {
        return User.find().select('-motDePasse');
    }

    async createUser(userData) {
        const { email, CIN, motDePasse } = userData;
        const existingUser = await User.findOne({ $or: [{ email }, { CIN }] });
        if (existingUser) {
            const error = new Error("Un utilisateur avec cet email ou CIN existe déjà.");
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);

        const newUser = new User({
            ...userData,
            motDePasse: hashedPassword
        });

        await newUser.save();
        // Ne pas retourner le mot de passe
        newUser.motDePasse = undefined;
        return newUser;
    }

    async updateUser(userId, updateData) {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("Utilisateur non trouvé.");
            error.statusCode = 404;
            throw error;
        }

        // Si un nouveau mot de passe est fourni, le hacher
        if (updateData.motDePasse) {
            const salt = await bcrypt.genSalt(10);
            updateData.motDePasse = await bcrypt.hash(updateData.motDePasse, salt);
        }

        Object.assign(user, updateData);
        await user.save();
        user.motDePasse = undefined;
        return user;
    }

    async deleteUser(userId) {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("Utilisateur non trouvé.");
            error.statusCode = 404;
            throw error;
        }
        await User.findByIdAndDelete(userId);
        return { msg: "Utilisateur supprimé avec succès" };
    }
    async confirmationCompte(id) {
        const user = await User.findById(id);
        if (!user) {
            const error = new Error("Utilisateur non trouvé.");
            error.statusCode = 404;
            throw error;
        }
        user.estActif = true;
        await user.save();
        return user;
    }
}

module.exports = new UserService();