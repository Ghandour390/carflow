const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class AuthController {
     register = async(req,res)=>{
        try{
            const {nom,prenom,email,motDePasse,dateNaissance,gender,adresse,CIN} = req.body;
          const user = await User.findOne({CIN});
        //   res.json({user:user});
            if(user){
                return res.status(400).json({msg:"CIN already exists"});
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
                CIN
            });
            await newUser.save();
            res.status(201).json({msg:"User created successfully",user:newUser});    
        }catch(err){
            console.log(err);
            res.status(500).json({msg:"Something went wrong", error: err});
        }
    };

    
    login = async(req,res)=>{
        try{
            const {email,motDePasse} = req.body;
            
            if(!email || !motDePasse){
                return res.status(400).json({msg:"Email and password are required"});
            }
            
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({msg:"email does not exist"});
            }
            
            if(!user.motDePasse){
                return res.status(400).json({msg:"User password not found"});
            }
            
            const isMatch = await bcrypt.compare(motDePasse,user.motDePasse);
            if(!isMatch){
                return res.status(400).json({msg:"le mot passe invalid"});
            }
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"});
            res.status(200).json({msg:"User logged in successfully", user:user,token:token});
        }catch(err){
            console.log(err);
            res.status(500).json({msg:"Something went wrong", error: err.message});
        }
    };
  logout = async(req,res)=>{
       try{
            res.status(200).json({msg:"User logged out successfully"});
        }catch(err){
            console.log(err);
            res.status(500).json({msg:"Something went wrong", error: err});
        }
    }    

     
    
    
}


module.exports = new AuthController();