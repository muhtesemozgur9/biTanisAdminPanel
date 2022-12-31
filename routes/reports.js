const express=require('express');
const router =express.Router();

const myController=require('../controllers/reports');

router.get('/',myController.reportsPage);
router.post('/list',myController.reportsList);

module.exports=router;