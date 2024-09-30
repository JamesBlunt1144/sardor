const router = require('express').Router()
const CategoryController = require('../controllers/CategoryController')

router.get('/', (req,res)=>{
    return res.json({success: true, msg: "Katigoriyalar ro`yhati"})
})

//CRUD / GET

router.get ('/All', CategoryController.AllCategory)


//CRUD / CREATE
router.post('/create', CategoryController.CategoryCreate)

//CRUD / UPDATE
router.put ('/update/:id',CategoryController.update)

//CRUD / DELETE

router.delete ('/delete/:id', CategoryController.delete)

// Ma`lumotni exselga yuklash
router.get('/exportToExcel', CategoryController.exportCategoryToExcel)

// Ma`lumotni izlash
router.get('/search', CategoryController.searchCategory)







module.exports = router

