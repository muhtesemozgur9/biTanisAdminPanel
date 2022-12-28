const express=require('express');
const router =express.Router();

const myController=require('../controllers/products');

router.get('/',myController.productsPage);
router.post('/list',myController.productsList);
router.post('/update',myController.updateProduct);
router.post('/add',myController.addProduct);

module.exports=router;