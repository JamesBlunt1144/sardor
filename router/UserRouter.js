const router = require('express').Router()
const UserController = require('../controllers/UserController')

//CRUD / READ
router.get('/all',UserController.getAllUsers)
router.get('/', UserController.getHome)

router.get("/:id", UserController.getOneUser)

//CRUD / CREATE
router.post ('/create', UserController.register)


router.post ('/auth',UserController.auth)

//CRUD / UPDATE
router.put ('/put/:id',UserController.put)

//CRUD / DELETE

router.delete ('/delete/:id', UserController.delete)


module.exports = router




