const express = require('express')
const router = express.Router()

const exampleController = require('../controllers/ExampleController')
const mockController = require('../controllers/MockController')

// Attach each endpoint to a specific function, on this case functions from controller
/*
router.get('/example', exampleController.list)
router.get('/example/:index', exampleController.retrieve)
router.post('/example', exampleController.create)
router.put('/example/:index', exampleController.update)
router.delete('/example/:index', exampleController.delete)
*/





router.get('/auth', mockController.auth)
router.post('/login', mockController.login)
router.post('/register', mockController.register)

router.get('/getUserInfo', mockController.getUserInfo)

router.get('/getMaletas', mockController.getMaletas)
router.get('/getMaletaByName/:name', mockController.getMaletaByName)
router.post('/createMaleta', mockController.createMaleta)

router.get('/getGrupos', mockController.getGrupos)
router.post('/createGrupo', mockController.createGrupo)

router.get('/getCriptoPrice/:id', mockController.getCriptoPrice)
router.get('/getCriptoHistory/:id', mockController.getCriptoHistory)


module.exports = router
