const Home = require('../models/home.model');
const homeValidate = require('../validate/home.validate');

const NotFoundError = require('../exception/notFoundError.exception');
const MyError = require('../exception/myError.exception');

class HomeService {
    getListHome = async (page, pageSize) => {
        const checkPage = homeValidate.validatePage(page, pageSize);

        if (checkPage.error) {
            return checkPage;
        }

        const homes = await Home.getHomes(page, pageSize);
        return { error: false, homes };
    };

    getHomeById = async (homeId) => {
        const home = await Home.getById(homeId);
        return home;
    };

    getHomesByCreatorId = async (creatorId) => {
        const homes = await Home.getByCreatorId(creatorId);
        return homes;
    };

    searchHomes = async (home, page, pageSize) => {
        const checkHomeResult = homeValidate.validateSearchHome(home);
        const checkPage = homeValidate.validatePage(page, pageSize);

        if (checkPage.error) {
            return checkPage;
        }

        // console.log(checkHomeResult.home);
        const homes = await Home.searchHomes(checkHomeResult.home);
        return { homes, error: false };
    };

    createHome = async (home, creatorId) => {
        home.creatorId = creatorId;
        const { error, statusCode, message } = homeValidate.validateHome(home);
        if (error) {
            return {
                error,
                statusCode,
                message,
            };
        }

        const newHome = new Home(home);
        await newHome.save();
        return {
            errors: false,
            home: newHome,
        };
    };

    deleteHomeById = async (homeId, creatorId) => {
        const validateResult = homeValidate.validateCreatorId(creatorId);
        if (validateResult.error) {
            return validateResult;
        }

        const home = await Home.deleteHomeById(homeId);
        if (home.error) {
            return new MyError(`you can't delete home with id ${homeId}`);
        }

        return {
            ...home,
            error: false,
        };
    };

    updateHomeById = async (homeId, home, creatorId) => {
        const { error, statusCode, message } = homeValidate.validateHome(home);
        if (error) {
            return {
                error,
                statusCode,
                message,
            };
        }

        const homeUpdate = await Home.updateHomeById(homeId, home, creatorId);
        if (homeUpdate.error) {
            return new MyError(`you can't update home with id ${homeId}`);
        }

        return {
            home: homeUpdate,
            error: false,
        };
    };
}

module.exports = new HomeService();
