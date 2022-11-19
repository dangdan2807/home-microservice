const homeService = require('../services/home.service');

class HomeController {
    // [GET] /api/product?page=1&pageSize=10
    getListHome = async (req, res, next) => {
        const { page = 0, pageSize = 10 } = req.query;
        try {
            const { homes, totalPages } = await homeService.getListHome(
                page,
                pageSize,
            );

            res.status(200).json({
                success: true,
                homes,
                page: parseInt(page) || page,
                pageSize: parseInt(pageSize) || pageSize,
                totalPages,
            });
        } catch (err) {
            next(err);
        }
    };

    // [GET] /api/product/:homeId
    getHomeById = async (req, res, next) => {
        const { homeId } = req.params;

        try {
            const home = await homeService.getHomeById(homeId);

            res.status(200).json({
                success: true,
                home,
            });
        } catch (error) {
            next(error);
        }
    };

    // [GET] /api/product/creator/:creatorId
    getHomesByCreatorId = async (req, res, next) => {
        const { creatorId } = req.params;

        try {
            const homes = await homeService.getHomesByCreatorId(creatorId);

            res.status(200).json({
                success: true,
                homes,
            });
        } catch (error) {
            next(error);
        }
    };

    // [GET] /api/product/search?name=&areaMore=&areaLess=&province=&district=&priceMore=&priceLess=&page=1&pageSize=10
    searchHomes = async (req, res, next) => {
        // const { name, areaMore, areaLess, province, district, priceMore, priceLess } = req.params;
        const page = req.query.page || 0;
        const pageSize = req.query.pageSize || 10;

        try {
            const { homes, totalPages } = await homeService.searchHomes(
                req.query,
                page,
                pageSize,
            );

            res.status(200).json({
                success: true,
                homes,
                page: parseInt(page) || page,
                pageSize: parseInt(pageSize) || pageSize,
                totalPages,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    // [POST] /api/product
    createHome = async (req, res, next) => {
        try {
            const { home } = await homeService.createHome(req.body, req.userId);

            return res.status(201).json({
                success: true,
                message: 'Create home successfully',
                home,
            });
        } catch (error) {
            next(error);
        }
    };

    // [DELETE] /api/product/:homeId
    deleteHomeById = async (req, res, next) => {
        const { homeId } = req.params;
        const { userId } = req;

        try {
            await homeService.deleteHomeById(homeId, userId);

            return res.status(200).json({
                success: true,
                message: 'Delete home successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    // [PATCH] /api/product/:homeId
    updateHomeById = async (req, res, next) => {
        const { homeId } = req.params;

        try {
            const { home } = await homeService.updateHomeById(
                homeId,
                req.body,
                req.userId,
            );

            return res.status(200).json({
                success: true,
                message: 'Update home successfully',
                home,
            });
        } catch (error) {
            next(error);
        }
    };

    // [POST] /api/product/image
    createHomeWithImage = async (req, res, next) => {
        try {
            // req.userId = 1;
            const { home } = await homeService.createHomeImage(
                req.body,
                req.userId,
                req.files,
            );

            return res.status(201).json({
                success: true,
                message: 'Create home successfully',
                home,
            });
        } catch (error) {
            next(error);
        }
    };

    // [PATCH] /api/product/:homeId/image
    updateHomeByIdWithImage = async (req, res, next) => {
        const { homeId } = req.params;
        req.userId = 1;

        try {
            const { home } = await homeService.updateHomeByIdWithImage(
                homeId,
                req.body,
                req.userId,
                req.files,
            );

            res.status(200).json({
                success: true,
                message: 'Update home successfully',
                home,
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = new HomeController();
