const User = require('../models/user')

const creteUser = async (req,res) => {
  const email = req.body.email;

    //  const newUser = User.create(req.body);
    //  console.log(newUser)
    //  res.json(newUser)

  const findUser = await User.findOne({ email : email });
  if(!findUser){
    const newUser = await User.create(req.body);
    res.json(newUser)
  }else{
    res.json({
      msg : "User already exit",
      success : false
    })
  }
}

module.exports = {creteUser}