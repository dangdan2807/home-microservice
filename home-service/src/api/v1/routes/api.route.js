const router = require('express').Router();
const homeController = require('../controllers/home.controller');
const upload = require('../../../utils/multer.util');
const authMiddleware = require('../middleware/auth.middleware');

const maxSize = 83886080; // 10MB

var uploadImgPost = upload.fields([
    { name: 'image1', maxCount: 1, limits: { fileSize: maxSize } },
    { name: 'image2', maxCount: 1, limits: { fileSize: maxSize } },
    { name: 'image3', maxCount: 1, limits: { fileSize: maxSize } },
    { name: 'image4', maxCount: 1, limits: { fileSize: maxSize } },
    { name: 'image5', maxCount: 1, limits: { fileSize: maxSize } },
]);

// [GET] /api/product/search?name=&areaMore=&areaLess=&province=&district=&priceMore=&priceLess=&page=1&pageSize=10
router.get('/search', homeController.searchHomes);
router.post(
    '/image',
    authMiddleware.verifyToken,
    uploadImgPost,
    homeController.createHomeWithImage,
);
router.get('/creator/:creatorId', homeController.getHomesByCreatorId);
router.put('/:homeId', authMiddleware.verifyToken, homeController.updateHomeById);
router.put(
    '/:homeId/image',
    authMiddleware.verifyToken,
    uploadImgPost,
    homeController.updateHomeByIdWithImage,
);
router.delete('/:homeId', authMiddleware.verifyToken, homeController.deleteHomeById);
router.get('/:homeId', homeController.getHomeById);
router.post('', authMiddleware.verifyToken, homeController.createHome);
// [GET] /api/product?page=1&pageSize=10
router.get('', homeController.getListHome);

module.exports = router;
