const Home = require('../models/home.model');
const homeValidate = require('../validate/home.validate');

const NotFoundError = require('../exception/NotFoundError');
const MyError = require('../exception/MyError');

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

    createHome = async (home) => {
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

    deleteHomeById = async (homeId) => {
        const home = await Home.getById(homeId);
        if (!home) {
            return new NotFoundError(`home with id ${homeId}`);
        }

        await Home.deleteHomeById(homeId);
        return {
            home,
            error: false,
        };
    };

    updateHomeById = async (homeId, home) => {
        const { error, statusCode, message } = homeValidate.validateHome(home);
        if (error) {
            return {
                error,
                statusCode,
                message,
            };
        }

        const homeUpdate = await Home.updateHomeById(homeId, home);
        return {
            home: homeUpdate,
            error: false,
        };
    };
}

module.exports = new HomeService();
