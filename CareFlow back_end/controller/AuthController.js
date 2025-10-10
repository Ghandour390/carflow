const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class AuthController {
     register = async(req,res)=>{
        try{
            const {nom,prenom,email,password,dateNaissance,genre,adresse,telephone,CIN} = req.body;
            const user = await User.findOne({CIN});
            if(user){
                return res.status(400).json({msg:"CIN already exists"});
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
            res.status(201).json({msg:"User created successfully",user:newUser});    
        }catch(err){
            console.log(err);
            res.status(500).json({msg:"Something went wrong"});
        }
    };

    
    login = async(req,res)=>{
        try{
            const {email,password} = req.body;

            const user = await User.findOne({email:req.body.email});
            if(!user){
                return res.status(400).json({msg:"email does not exist"});
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({msg:"le mot passe invalid"});
            }
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"});
            res.status(200).json({msg:"User logged in successfully", user:user,token:token});
        }catch(err){
            console.log(err);
            res.status(500).json({msg:"Something went wrong"});
        }
    }
     
    
    
}


module.exports = new AuthController();