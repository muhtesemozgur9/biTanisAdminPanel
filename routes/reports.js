const express=require('express');
const router =express.Router();

const myController=require('../controllers/reports');
const authControl=require('../middlewares/authcontrol');

router.get('/',authControl.auth_control,myController.reportsPage);
router.post('/list',authControl.auth_control,myController.reportsList);

module.exports=router;