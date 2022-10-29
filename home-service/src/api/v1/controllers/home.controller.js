const Home = require('../models/home.model');
const homeService = require('../services/home.service');

class HomeController {
    // [GET] /api/product?page=1&pageSize=10
    getListHome = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        try {
            const { homes, error, message, statusCode } = await homeService.getListHome(
                page,
                pageSize,
            );

            if (error) {
                return res.status(statusCode).json({ success: false, message });
            }

            return res.status(200).json({
                success: true,
                homes,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    // [GET] /api/product/:homeId
    getHomeById = async (req, res) => {
        const { homeId } = req.params;

        try {
            const home = await homeService.getHomeById(homeId);

            res.status(200).json({
                success: true,
                home,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    // [GET] /api/product/creator/:creatorId
    getHomesByCreatorId = async (req, res) => {
        const { creatorId } = req.params;

        try {
            const homes = await homeService.getHomesByCreatorId(creatorId);

            res.status(200).json({
                success: true,
                homes,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    // [GET] /api/product/search?name=&areaMore=&areaLess=&province=&district=&priceMore=&priceLess=&page=1&pageSize=10
    searchHomes = async (req, res) => {
        // const { name, areaMore, areaLess, province, district, priceMore, priceLess } = req.params;
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;

        try {
            const { homes, error, message, statusCode } = await homeService.searchHomes(
                req.query,
                page,
                pageSize,
            );

            if (error) {
                return res.status(statusCode).json({
                    success: false,
                    message,
                });
            }

            res.status(200).json({
                success: true,
                homes,
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
    createHome = async (req, res) => {
        try {
            const { home, error, message, statusCode } = await homeService.createHome(
                req.body,
                req.userId,
            );
            if (error) {
                return res.status(statusCode).json({
                    success: false,
                    message,
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Create home successfully',
                home,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    // [DELETE] /api/product/:homeId
    deleteHomeById = async (req, res) => {
        const { homeId } = req.params;
        const { userId } = req;

        try {
            const { home, error, message, statusCode } = await homeService.deleteHomeById(homeId, userId);
            if (error) {
                return res.status(statusCode).json({
                    success: false,
                    message,
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Delete home successfully',
                home,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    // [PATCH] /api/product/:homeId
    updateHomeById = async (req, res) => {
        const { homeId } = req.params;

        try {
            const { home, error, message, statusCode } = await homeService.updateHomeById(
                homeId,
                req.body,
                req.userId,
            );
            if (error) {
                return res.status(statusCode).json({
                    success: false,
                    message,
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Update home successfully',
                home,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };
}

module.exports = new HomeController();
