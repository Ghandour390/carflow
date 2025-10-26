const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const MailService = require('./MailService');

class AuthService {
    async register({ nom, prenom, email, motDePasse, dateNaissance, gender, adresse, CIN }) {
        console.log(`email=${email} and CIN=${CIN}`);
        const existingUser = await User.findOne({ $or: [{ email }, { CIN }] });
        if (existingUser) {
        const message = existingUser.email === email
            ? "Un utilisateur avec cet email existe déjà."
            : "Un utilisateur avec ce CIN existe déjà.";
        const error = new Error(message);
        error.statusCode = 400;
        throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);

        const newUser = new User({
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        dateNaissance,
        gender,
        adresse,
        CIN,
        });

        await newUser.save();

    try {
    console.log(`ℹ️ AuthService: sending confirmation email to ${email}`);
    const code = await MailService.sendConfirmationCode(email, prenom, nom);
    console.log(`✅ AuthService: confirmation email sent to ${email} (code=${code})`);
    } catch (err) {
    console.error('❌ AuthService: failed to send confirmation email:', err.message || err);
    }

        newUser.motDePasse = undefined;
        return newUser;
    }



    async login({ email, motDePasse }) {
        if (!email || !motDePasse) {
            const error = new Error("L'email et le mot de passe sont requis.");
            error.statusCode = 400;
            throw error;
        }



        const maxAttempts = 10;
        const windowSeconds = 10;
        const key = `login-attempt:${email}`;

        const attempts = await redisClient.incr(key);
        if (attempts === 1) {
            await redisClient.expire(key, windowSeconds);
        }

        if (attempts > maxAttempts) {
            const error = new Error(`Trop de tentatives de connexion. Veuillez réessayer dans ${windowSeconds} secondes.`);
            error.statusCode = 429;
            throw error;
        }

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Email ou mot de passe invalide.");
            error.statusCode = 400; 
        }

        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isMatch) {
            const error = new Error("Email ou mot de passe invalide.");
            error.statusCode = 400;
            throw error;
        }


    await redisClient.del(key);

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        

        user.motDePasse = undefined;
        return { user, token };
    }

    async getConfirmationEmail({ email }) {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Aucun utilisateur trouvé avec cet email.");
            error.statusCode = 404;
            throw error;
        }
        return MailService.sendConfirmationCode(email, user.prenom, user.nom);
    }

    async confirmationEmail({ email, codeConfirmation }) {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Utilisateur non trouvé.");
            error.statusCode = 404;
            throw error;
        }

        const isValid = await MailService.verifyConfirmationCode(email, codeConfirmation);
        if (!isValid) {
            const error = new Error("Code de confirmation invalide ou expiré.");
            error.statusCode = 400;
            throw error;
        }

        user.isConfirmed = true;
        await user.save();

        // Clear the confirmation code after successful verification
        await MailService.clearConfirmationCode(email);

        user.motDePasse = undefined;
        return user;
    }
}

module.exports = new AuthService();