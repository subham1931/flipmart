const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser)
    } else {
        // res.json({
        //     msg: "user alreay exist",
        //     success: false
        // })
        throw new Error("User already exist")
    }
})


//login a user
const loginUserCtrl = asyncHandler(async(req,res) => {
    const {email, password} = req.body;
    const findUser = await User.findOne({email});
    if(findUser && (await findUser.isPasswordMatched(password))){
        res.json({
            _id : findUser?._id,
            firstname : findUser?.firstname,
            lastname : findUser?.lastname,
            email : findUser?.email,
            mobile : findUser?.email,
            token : generateToken(findUser?._id)
        })
        // res.json({findUser})
    }else{
        throw new Error('Invalid credentials')
    }
})


//update a user
const updatedUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(id,{
            firstname : req?.body?.firstname,
            lastname : req?.body?.lastname,
            email : req?.body?.email,
            mobile : req?.body?.mobile,
        },{
            new: true,
        });
        res.json({
            updatedUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

//fetch all users
const getallUsers = asyncHandler(async(req,res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

//get a single users
const getaUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser
        })
        // console.log(id);
    } catch (error) {
        throw new Error(error)
    }
})

//delete a single users
const deleteaUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser
        })
        // console.log(id);
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { createUser, loginUserCtrl, getallUsers, getaUser,deleteaUser,updatedUser}