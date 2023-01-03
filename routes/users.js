const express=require('express');
const router =express.Router();

const myController=require('../controllers/users');
const authControl=require('../middlewares/authcontrol');

router.get('/',authControl.auth_control,myController.usersPage);
router.post('/list',authControl.auth_control,myController.usersList);
router.post('/delete',authControl.auth_control,myController.deleteUser);
router.post('/createBot',authControl.auth_control,myController.uploadUser);

module.exports=router;