const express = require('express');
const homeController = require('../api/v1/controllers/home.controller');
const router = express.Router();

const authMiddleware = require('../api/v1/middleware/auth.middleware');

// [GET] /api/product/search?name=&areaMore=&areaLess=&province=&district=&priceMore=&priceLess=&page=1&pageSize=10
router.get('/search', homeController.searchHomes);
router.get('/creator/:creatorId', homeController.getHomesByCreatorId);
router.patch('/:homeId', authMiddleware.verifyToken, homeController.updateHomeById);
router.delete('/:homeId', authMiddleware.verifyToken, homeController.deleteHomeById);
router.get('/:homeId', homeController.getHomeById);
router.post('', authMiddleware.verifyToken, homeController.createHome);
// [GET] /api/product?page=1&pageSize=10
router.get('', homeController.getListHome);

module.exports = router;
