const Home = require('../models/home.model');

const homeValidate = require('../validate/home.validate');

const commonUtils = require('../../../utils/common.util');

class HomeService {
    getListHome = async (page, pageSize) => {
        homeValidate.validatePage(page, pageSize);

        const totalHomes = await Home.countDocuments();

        const { skip, limit, totalPages } = commonUtils.getPagination(
            parseInt(page) || page,
            parseInt(pageSize) || pageSize,
            totalHomes,
        );

        const homes = await Home.getHomes(skip, limit);

        return { homes, totalPages };
    };

    getHomeById = async (homeId) => {
        const result = await Home.getById(homeId);
        return { error: result.error, home: result.home };
    };

    getHomesByCreatorId = async (creatorId) => {
        const homes = await Home.getByCreatorId(creatorId);
        return homes;
    };

    searchHomes = async (home, page, pageSize) => {
        const checkHomeResult = homeValidate.validateSearchHome(home);
        await homeValidate.validatePage(page, pageSize);

        const totalHomes = await Home.countDocuments(checkHomeResult.home);

        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            pageSize,
            totalHomes,
        );

        // console.log(checkHomeResult.home);
        const homes = await Home.searchHomes(checkHomeResult.home, skip, limit);
        return { error: false, homes, totalPages };
    };

    createHome = async (home, creatorId) => {
        home.creatorId = creatorId;
        await homeValidate.validateHome(home);
        homeValidate.uploadImage(home.image);

        home.address = {
            street: home.street,
            province: home.province,
            district: home.district,
        };
        const newHome = new Home(home);
        await newHome.save();
        return {
            errors: false,
            home: newHome,
        };
    };

    createHomeImage = async (home, creatorId, images) => {
        home.creatorId = creatorId;
        await homeValidate.validateHome(home);

        const uploadImages = await homeValidate.uploadImage(images);
        home.image = uploadImages;

        home.address = {
            street: home.street,
            province: home.province,
            district: home.district,
        };

        const newHome = new Home(home);
        await newHome.save();

        return {
            errors: false,
            home: newHome,
        };
    };

    deleteHomeById = async (homeId, creatorId) => {
        await homeValidate.validateCreatorId(creatorId);

        await Home.deleteHomeById(homeId, creatorId);
    };

    updateHomeById = async (homeId, home, creatorId) => {
        home.creatorId = creatorId;
        await homeValidate.validateHome(home);
        const { newImages } = await homeValidate.deleteOldImage(
            homeId,
            home.image,
        );
        home.image = newImages;

        home.address = {
            street: home.street,
            province: home.province,
            district: home.district,
        };

        const homeUpdate = await Home.updateHomeById(homeId, home, creatorId);

        return {
            home: homeUpdate,
        };
    };

    updateHomeByIdWithImage = async (homeId, home, creatorId, images) => {
        home.creatorId = creatorId;
        await homeValidate.validateHome(home);
        const { newImages } = await homeValidate.deleteOldImage(
            homeId,
            home.image,
        );
        home.image = newImages;

        const uploadImages = await homeValidate.uploadImage(images);
        home.image = [...home.image, ...uploadImages];

        home.address = {
            street: home.street,
            province: home.province,
            district: home.district,
        };

        const homeUpdate = await Home.updateHomeById(homeId, home, creatorId);

        return {
            home: homeUpdate,
        };
    };
}

module.exports = new HomeService();
