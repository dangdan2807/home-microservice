const Home = require('../models/home.model');

const redisDb = require('../../../config/redis.config');

const homeValidate = require('../validate/home.validate');

const commonUtils = require('../../../utils/common.util');

const HOME_NAME_REDIS = 'homes';

class HomeService {
    getListHome = async (page, pageSize) => {
        homeValidate.validatePage(page, pageSize);

        const totalHomes = await Home.countDocuments();

        const { skip, limit, totalPages } = commonUtils.getPagination(
            parseInt(page) || page,
            parseInt(pageSize) || pageSize,
            totalHomes,
        );

        const isExistsCached = await redisDb.get(HOME_NAME_REDIS);
        let homes = [];
        if (!isExistsCached || isExistsCached.length === 0) {
            const homesResult = await Home.getHomes(skip, limit);
            homes = homesResult;

            const saveHomeIds = [];
            homesResult.forEach((home) =>
                saveHomeIds.push(home._id.toString()),
            );

            // Set cache
            await redisDb.set(HOME_NAME_REDIS, saveHomeIds);
            homesResult.forEach(
                async (home) => await redisDb.set(home._id.toString(), home),
            );
        } else {
            for (let item of isExistsCached) {
                const home = await redisDb.get(item);
                homes.push(home);
            }
        }

        // const homes = await Home.getHomes(skip, limit);

        return { homes, totalPages };
    };

    getHomeById = async (homeId) => {
        let home = await redisDb.get(homeId);
        if (!home) {
            const result = await Home.getById(homeId);
            home = result.home;
            await redisDb.set(homeId, home);
        }

        return home;
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
        const saveHome = await newHome.save();

        // Update cache
        const homes = await redisDb.get(HOME_NAME_REDIS);
        homes.push(saveHome._id.toString());

        await Promise.all([
            redisDb.set(saveHome._id.toString(), saveHome),
            redisDb.set(HOME_NAME_REDIS, homes),
        ]);

        return {
            errors: false,
            home: saveHome,
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
        const saveHome = await newHome.save();

        // Update cache
        const homes = await redisDb.get(HOME_NAME_REDIS);
        homes.push(saveHome._id.toString());

        await Promise.all([
            redisDb.set(saveHome._id.toString(), saveHome),
            redisDb.set(HOME_NAME_REDIS, homes),
        ]);

        return {
            errors: false,
            home: newHome,
        };
    };

    deleteHomeById = async (homeId, creatorId) => {
        await homeValidate.validateCreatorId(creatorId);

        await Home.deleteHomeById(homeId, creatorId);
        // Update cache
        const homes = await redisDb.get(HOME_NAME_REDIS);
        const index = homes.indexOf(homeId);
        homes.splice(index, 1);
        await Promise.all([
            redisDb.remove(homeId),
            redisDb.set(HOME_NAME_REDIS, homes),
        ]);

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

        // Update cache
        await redisDb.set(homeId, homeUpdate);

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
        
        // Update cache
        await redisDb.set(homeId, homeUpdate);

        return {
            home: homeUpdate,
        };
    };
}

module.exports = new HomeService();
