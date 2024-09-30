const router = require('express').Router()
const ClientController = require('../controllers/ClientController')

router.get('/', (req,res)=>{
    return res.json({success: true, msg: "Mijozlar ro`yhati"})
})


router.get('/all', ClientController.getAllClients)

router.post('/create', ClientController.ClientCreate)

router.put('/update/:id', ClientController.update)

router.delete('/delete/:id', ClientController.delete)

router.get('/search',ClientController.searchClients)

router.get('/filterByDate', ClientController.filterClientsByDate)




module.exports = router

