const Product = require('../models/product')
const Category = require('../models/category')
const mongoose = require('mongoose')


const createCategory = async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })

    console.log(category)


    try {

        const newCategory = await category.save();
        res.status(201).json(newCategory)
    } catch (error) {
        return res.status(400).json(
            {
                message: 'the category cannot be created!',
                error: error.message
            })
    }


}

const fetchAllCategories = async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(categoryList);
}


const fetchCategoryById = async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ message: 'The category with the given ID was not found.' })
    }
    res.status(200).send(category);
    console.log(category)
}

const updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        { new: true }
    )

    if (!category)
        return res.status(400).send('the category cannot be created!')

    res.send(category);
}

const deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ success: true, message: 'the category is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "category not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
}



module.exports ={
        createCategory,
        fetchAllCategories,
        fetchCategoryById,
        updateCategory,
        deleteCategory

}