const express=require('express');
const router =express.Router();

const myController=require('../controllers/products');
const authControl=require('../middlewares/authcontrol');

router.get('/',authControl.auth_control,myController.productsPage);
router.post('/list',authControl.auth_control,myController.productsList);
router.post('/update',authControl.auth_control,myController.updateProduct);
router.post('/add',authControl.auth_control,myController.addProduct);

module.exports=router;