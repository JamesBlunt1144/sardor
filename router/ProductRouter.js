const router = require('express').Router()
const ProductController = require('../controllers/ProductController')

router.get('/', (req,res)=>{
    return res.json({success: true, msg: "Maxsulotlar ro`yhati"})
})


router.get('/all',ProductController.getAllProduct)

router.post ("/create", ProductController.ProdCreate)

router.put ('/update/:id', ProductController.UpdateProd)

router.delete ('/delete/:id', ProductController.deleteProd )

router.get('/exportToExcel' , ProductController.exportProductsToExcel)

router.get('/search', ProductController.searchProducts)

router.get ('/:id', ProductController.getOneProduct )
module.exports = router

