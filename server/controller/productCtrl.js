const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

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

const deleteProduct = asyncHandler(async(req,res) => {
    const {id}  = req.params; 
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
        const getAllProducts = await Product.find();
        res.json(getAllProducts);
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct }