const express = require('express');
const homeController = require('../api/v1/controllers/home.controller');
const router = express.Router();

router.get('/search', homeController.searchHomes);
router.get('/creator/:creatorId', homeController.getHomesByCreatorId);
router.patch('/:homeId', homeController.updateHomeById);
router.delete('/:homeId', homeController.deleteHomeById);
router.get('/:homeId', homeController.getHomeById);
router.post('', homeController.createHome);
// [GET] /api/product?page=1&pageSize=10
router.get('', homeController.getListHome);

module.exports = router;
