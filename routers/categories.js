const Category = require('../models/category');
const express=  require('express');
const router = express.Router();


//add category to database
router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })

    category = await category.save()
    if (!category) {
        return res.status(404).send('hello category is non existent')
    }
    return res.send(category)

})

//retrieve all categories from the database

router.get('/', async (req, res) => {
  const categoryList =  await Category.find()
  if(!categoryList){
    res.status(500).json({success:false})
  }
  res.status(200).send(categoryList)

})

//get individual category -we can use id of the category(route params)

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        res.status(500).json({
            success: false,
            message: 'category with the give id not found'
        })
    }
    res.status(200).send(category)

})

//update a specific category in database
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,

        },
        { new: true }
    )
    // category.save()
    if (!category) {
        res.status(500).json({
            success: false,
            message: 'category with the give id not found'
        })
    }
    res.send(category)

})



//delete category from database  - we use url parameters to get specific id of category
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                res.status(200).json({
                    success: true,
                    message: "Category deleted successfully"
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: "Category not found"
                })
            }
        }).catch((error) => {
            res.status(400).json({
                success: false,
                message: "Server error"
            })
        })
})

module.exports =router;



