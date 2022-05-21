const express = require('express')
const router = express.Router()

const ApiController = require('../controllers/ApiController')


/*
const exampleController = require('../controllers/ExampleController')
router.get('/example', exampleController.list)
router.get('/example/:index', exampleController.retrieve)
router.post('/example', exampleController.create)
router.put('/example/:index', exampleController.update)
router.delete('/example/:index', exampleController.delete)
*/


router.get('/auth', ApiController.auth)
router.post('/login', ApiController.login)
router.post('/register', ApiController.register)

router.get('/getUserInfo', ApiController.getUserInfo)

router.get('/getMaletas', ApiController.getMaletas)
router.get('/getMaletaByName/:name', ApiController.getMaletaByName)
router.post('/createMaleta', ApiController.createMaleta)

router.get('/getRegistros/:id', ApiController.getRegistros)
router.post('/createRegistro', ApiController.createRegistro)

router.get('/getGrupos', ApiController.getGrupos)
router.post('/createGrupo', ApiController.createGrupo)

router.get('/getCriptoPrice/:id', ApiController.getCriptoPrice)
router.get('/getCriptoHistory/:id', ApiController.getCriptoHistory)


module.exports = router
