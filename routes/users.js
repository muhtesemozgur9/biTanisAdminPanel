const express=require('express');
const router =express.Router();

const myController=require('../controllers/users');

router.get('/',myController.usersPage);
router.post('/list',myController.usersList);
router.post('/delete',myController.deleteUser);

module.exports=router;