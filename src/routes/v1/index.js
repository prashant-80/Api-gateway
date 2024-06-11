const express = require('express');

const { InfoController } = require('../../controllers');
const  {AuthRequestMiddlewares} = require('../../middlewares')
const router = express.Router();

const userRoutes = require('./user-routes')

router.get('/info', AuthRequestMiddlewares.checkAuth, InfoController.info);

router.use('/user',userRoutes);

module.exports = router;