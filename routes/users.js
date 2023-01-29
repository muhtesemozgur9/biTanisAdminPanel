const express=require('express');
const router =express.Router();

const myController=require('../controllers/users');
const authControl=require('../middlewares/authcontrol');

router.get('/',authControl.auth_control,myController.usersPage);
router.post('/list',authControl.auth_control,myController.usersList);
router.post('/delete',authControl.auth_control,myController.deleteUser);
router.post('/createBot',authControl.auth_control,myController.uploadUser);
router.get('/messages/:docId/:senderId/:receiverName',authControl.auth_control,myController.userMessagePage);
router.get('/messageList',authControl.auth_control,myController.userMessageListPage);
router.post('/messageList',authControl.auth_control,myController.userMessageListPost);
router.post('/messages/:docId',authControl.auth_control,myController.userMessageList);
router.post('/sendMessage',authControl.auth_control,myController.sendMessage);

module.exports=router;