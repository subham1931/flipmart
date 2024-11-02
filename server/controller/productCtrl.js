const { json } = require('body-parser')
const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const User = require('../models/userModel')

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})


const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extracting id directly
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate(
            { _id: id }, // Using _id as the key if your primary key is _id
            req.body,
            { new: true }
        );
        if (!updateProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {

        const deleteProduct = await Product.findOneAndDelete(id)

        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
})

const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
})

const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((elm) => delete queryObj[elm]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        //limiting fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This Page does not exists");
        }

        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error)
    }
})

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) =>
            id.toString() === prodId
        );

        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId }
            }, { new: true })
            res.json(user)
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId }
            }, { new: true })
            res.json(user)
        }
    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct ,addToWishlist}