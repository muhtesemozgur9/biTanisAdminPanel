const express=require('express');
const router =express.Router();

const myController=require('../controllers/messages');
const authControl=require('../middlewares/authcontrol');

router.get('/',authControl.auth_control,myController.messagesPage);
router.post('/list',authControl.auth_control,myController.messagesList);
router.post('/delete',authControl.auth_control,myController.deleteMessage);
router.post('/add',authControl.auth_control,myController.addMessage);
router.post('/update',authControl.auth_control,myController.updateMessage);

module.exports=router;