const Category = require('../models/category');
const express = require('express');
const router = express.Router();

const { createCategory,
  fetchAllCategories,
  fetchCategoryById,
  updateCategory,
  deleteCategory } = require('../controllers/categoryController')

router.get(`/`, fetchAllCategories)

router.get('/:id', fetchCategoryById)



router.post('/',)


router.put('/:id', updateCategory)

router.delete('/:id',deleteCategory )

module.exports = router;