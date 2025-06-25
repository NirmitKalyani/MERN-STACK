const{User} = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function handleUserSignup(req,res){
    try{
        let{name,email,password} = req.body;

        if(!name && !email && !password){
            res.status(404).send({
                msg:"all fields are required"
            });
        }

        const isUserAlreadyExists = await User.findOne({email:email});
        if(isUserAlreadyExists){
            res.status(404).send({
                msg:"User already exists",
                isUserAlreadyExists,
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password,salt);

        const token = jwt.sign({email},"secretkey",{expiresIn:"365d"});

        let user = await User.create({
            name,
            email,
            password:hashedPassword,
            token,
            role:"user",
        });
        if(user){
            res.send("user added")
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg:"Internal Server Error",
            error,
        });
    }
}

async function handleUserLogin(req,res){
    try{
        let{email,password} = req.body;

        if(!email && !password){
            res.status(404).send({
                msg:"all fields are required",
            });
        }

        const user = await User.findOne({email:email});
        if(!user){
            return res.send(404).send({
                msg:"User not found"
            })
        }

        const isPasswordMatch = bcrypt.compareSync(password,user.password);
        if(!isPasswordMatch){
            return res.send({
                msg:"Password does not match",
            });
        }

        res.send({
            msg:"User logged in",
            user,
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg:"internal server error",
            error,
        })
    }
}

module.exports = {
    handleUserLogin,
    handleUserSignup
};
