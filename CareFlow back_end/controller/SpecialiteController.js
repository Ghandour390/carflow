const { Specialite} = require('../models/specialite');


class SpecialiteController{
    async createSpecialite(req, res) {
        try {
            const { name } = req.body;
            const specialite = new Specialite({ name });
            await specialite.save();
            res.status(201).json({ msg: "Specialite created successfully", specialite: specialite });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async getSpecialites(req, res) {
        try {
            const specialites = await Specialite.find();
            res.status(200).json(specialites);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async updateSpecialite(req, res) {
        try {
            const { name } = req.body;
            const specialiteId = req.params.id;
            if(!specialiteId){return res.status(400).json({ msg: "Specialite id is required" });}
            const specialite = await Specialite.findById(specialiteId);
            if (!specialite) {
                return res.status(400).json({ msg: "Specialite does not exist" });
            }
            specialite.name = name || specialite.name;
            await specialite.save();
            res.status(200).json({ msg: "Specialite updated successfully", specialite: specialite });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async deleteSpecialite(req, res) {
        try {
            const specialiteId = req.params.id;
            if(!specialiteId){return res.status(400).json({ msg: "Specialite id is required" });}
            const specialite = await Specialite.findById(specialiteId);
            if (!specialite) {
                return res.status(400).json({ msg: "Specialite does not exist" });
            }
            await specialite.deleteOne({_id: specialiteId});
            res.status(200).json({ msg: "Specialite deleted successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
}

module.exports = new SpecialiteController();