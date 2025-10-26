const AuthService = require('../services/AuthService');

class AuthController {
    register = async (req, res) => {
        try {
            const redisClient = req.redis;
            const newUser = await AuthService.register({ ...req.body, redisClient });
            res.status(201).json({ msg: "Utilisateur créé avec succès", user: newUser });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Une erreur est survenue" });
        }
    };
    getConfirmationEmail = async (req, res) => {
        try {
            const { email } = req.params;
            await AuthService.getConfirmationEmail({ email });
            res.status(200).json({ msg: "Code de confirmation envoyé avec succès" });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Une erreur est survenue" });
        }
    };

    confirmationEmail = async (req, res) => {
        try {
            const { email, codeConfirmation } = req.params;
            const user = await AuthService.confirmationEmail({ email, codeConfirmation });
            res.status(200).json({ msg: "Compte confirmé avec succès", user });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Une erreur est survenue" });
        }
    };


    login = async (req, res) => {
        try {
            const redisClient = req.redis;
            const { user, token } = await AuthService.login({ ...req.body, redisClient });
            res.status(200).json({ msg: "Utilisateur connecté avec succès", user, token });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Une erreur est survenue" });
        }
    };

    logout = async (req, res) => {
        try {
            // Ici, vous pourriez ajouter une logique de blacklistage de token si nécessaire
            res.status(200).json({ msg: "Utilisateur déconnecté avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Une erreur est survenue", error: error.message });
        }
    }
}

module.exports = new AuthController();