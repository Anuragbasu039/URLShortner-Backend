const express = require('express')
const { handleUserSignup } = require('../Controllers/user')
const {handleUserLogin} = require('../Controllers/user')
const router = express.Router();

router.post('/',handleUserSignup )
router.post('/login',handleUserLogin )

module.exports = router