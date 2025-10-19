
const IsMedecin = (req , res , next){
    if(req.user.role !== 'medecin'){
        return res.status(403).json({message: "Access denied, not a medecin"});
    }else{
        next();
    }
}