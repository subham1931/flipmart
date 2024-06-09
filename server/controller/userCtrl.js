const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken')

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
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, { new: true });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.email,
            token: generateToken(findUser?._id)
        })
        // res.json({findUser})
    } else {
        throw new Error('Invalid credentials')
    }
})

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    console.log(cookie);

    if (!cookie?.refreshToken) {
        throw new Error('No refresh token in the cookies')
    }
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({ refreshToken })
    if (!user) {
        throw new Error('Refresh token not matched user in the db')
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('Something went Wrong')
        }

        const accessToken = generateToken(User?._id)
        res.json({ accessToken })
    })
})

//logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error('No refresh token in cookies')
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })

    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: "",
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204)
})


//update a user
const updatedUser = asyncHandler(async (req, res) => {
    // console.log(req.user);
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, {
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
const getallUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

//get a single users
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(_id)
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
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(_id)
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

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(_id)
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        )
        res.json({
            message: "User Blocked"
        });
    } catch (error) {
        throw new Error(error);
    }
})

const unBlockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(_id)
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            }, {
            new: true
        }
        )
    } catch (error) {
        throw new Error(error);
    }
    res.json({
        message: "User UnBlocked"
    });
})


module.exports = { createUser, loginUserCtrl, getallUsers, getaUser, deleteaUser, updatedUser, blockUser, unBlockUser, handleRefreshToken, logout }