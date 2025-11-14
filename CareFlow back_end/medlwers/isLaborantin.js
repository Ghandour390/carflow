const User = require('../models/User');
const {getCachedUser , cacheUser} = require('../utils/userCache');


const laborantin = async (req , res,next) =>{
    try {
        const userId = req.user.id;
        let user = null ;
        user = await getCachedUser(userId);
        if (!user) {
            user = await User.findById(userId);
            return res.status(404).json("utilisateur n'est pas trouvé")
        }
        await cacheUser(userId,user);
        if(user.role !== "laborantin"){
            return res.status(401).json("n'est pas authorization")
        }else{
            req.user = user;
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({err: error});
    }
};
module.exports = laborantin ;