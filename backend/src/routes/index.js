const express = require('express')
const router = express.Router()

const exampleController = require('../controllers/ExampleController')
const mockController = require('../controllers/MockController')

// Attach each endpoint to a specific function, on this case functions from controller
router.get('/example', exampleController.list)
router.get('/example/:index', exampleController.retrieve)
router.post('/example', exampleController.create)
router.put('/example/:index', exampleController.update)
router.delete('/example/:index', exampleController.delete)



router.post('/auth', mockController.auth)
router.post('/login', mockController.login)
router.post('/register', mockController.register)
router.post('/getUserInfo', mockController.getUserInfo)

router.post('/getMaletas', mockController.getMaletas)
router.post('/createMaleta', mockController.createMaleta)

router.post('/getGrupos', mockController.getGrupos)
router.post('/createGrupo', mockController.createGrupo)


module.exports = router
