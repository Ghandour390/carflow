const {Role} = require('../models/role');



class RoleController{
    async createRole(req, res) {
        try {
            const { name } = req.body;
            const role = new Role({ name });
            await role.save();
            res.status(201).json({ msg: "Role created successfully", role: role });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async getRoles(req, res) {
        try {
            const roles = await Role.find();
            res.status(200).json(roles);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async updateRole(req, res) {
        try {
            const { name } = req.body;
            const roleId = req.params.id;
            if(!roleId){return res.status(400).json({ msg: "Role id is required" });}
            const role = await Role.findById(roleId);
            if (!role) {
                return res.status(400).json({ msg: "Role does not exist" });
            }
            role.name = name || role.name;
            await role.save();
            res.status(200).json({ msg: "Role updated successfully", role: role });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async deleteRole(req, res) {
        try {
            const roleId = req.params.id;
            if(!roleId){return res.status(400).json({ msg: "Role id is required" });}
            const role = await Role.findById(roleId);
            if (!role) {
                return res.status(400).json({ msg: "Role does not exist" });
            }
            await role.deleteOne({_id: roleId});
            res.status(200).json({ msg: "Role deleted successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
}

module.exports = new RoleController();