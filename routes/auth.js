const express=require('express');
const router =express.Router();

const myController=require('../controllers/auth');

router.get('/',myController.loginPage);
router.post('/login',myController.login);

module.exports=router;