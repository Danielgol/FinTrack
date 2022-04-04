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

router.post('/login', mockController.login)
router.post('/register', mockController.register)
router.post('/getInfo', mockController.getInfo)

module.exports = router
