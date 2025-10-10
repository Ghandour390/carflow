
const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserController {
    async getUser(req, res) {
        try {
            const user = await User.findById(req.user.id);
            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async updateUser(req, res) {
        try {
            const { nom, prenom, email, password, dateNaissance, genre, adresse, telephone, CIN } = req.body;
            const userId = req.params.id;
            if(!userId){return res.status(400).json({ msg: "User id is required" });}
            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ msg: "User does not exist" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.nom = nom || user.nom;
            user.prenom = prenom || user.prenom ;
            user.email = email || user.email;
            user.password = hashedPassword || user.password;
            user.dateNaissance = dateNaissance || user.dateNaissance;
            user.genre = genre || user.genre;
            user.adresse = adresse || user.adresse;
            user.telephone = telephone || user.telephone;
            user.CIN = CIN || user.CIN;
            await user.save();
            res.status(200).json({ msg: "User updated successfully", user: user });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            if(!userId){return res.status(400).json({ msg: "User id is required" });}
            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ msg: "User does not exist" });
            }
            await user.deleteOne({_id: userId});
            res.status(200).json({ msg: "User deleted successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async createUser(req, res) {
        try {
            const { nom, prenom, email, password, dateNaissance, genre, adresse, telephone, CIN } = req.body;
            const user = await User.findOne({ CIN });
            if (user) {
                return res.status(400).json({ msg: "User already exists" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new User({
                nom,
                prenom,
                email,
                password: hashedPassword,
                dateNaissance,
                genre,
                adresse,
                telephone,
                CIN
            });
            await newUser.save();
            res.status(200).json({ msg: "User created successfully", user: newUser });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
}
module.exports = new UserController();