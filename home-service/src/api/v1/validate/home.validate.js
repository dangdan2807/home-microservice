const cloudinary = require('../../../utils/cloudinary.util');
const commonUtil = require('../../../utils/common.util');

const MyError = require('../exception/myError.exception');
const Home = require('../models/home.model');

const MESSAGE_INVALID = 'không hợp lệ';
const IMG_INVALID = 'không đúng định dạng url';
const NAME_REGEX = /\w{1,255}/;
const URL_REGEX = /^[a-z0-9-]+$/;

class HomeValidate {
    validateHome = (home) => {
        const { name, street, province, district, price, area, creatorId } =
            home;

        let error = {};

        if (!name || !NAME_REGEX.test(name)) {
            error.name = `Tên ${MESSAGE_INVALID}`;
        }

        if (!street || !NAME_REGEX.test(street)) {
            error.street = `đường ${MESSAGE_INVALID}`;
        }

        if (!province || !NAME_REGEX.test(province)) {
            error.province = `tỉnh ${MESSAGE_INVALID}`;
        }

        if (!district || !NAME_REGEX.test(district)) {
            error.district = `quận ${MESSAGE_INVALID}`;
        }

        if (!price || !commonUtil.isNumber(price)) {
            error.price = `giá phải là số`;
            if (price < 0) {
                error.price = `giá phải lớn hơn 0`;
            }
        }

        if (!area || !commonUtil.isNumber(area)) {
            error.area = `diện tích phải là số`;
            if (area < 0) {
                error.area = `diện tích phải lớn hơn 0`;
            }
        }

        if (!creatorId || !commonUtil.isNumber(creatorId)) {
            error.creatorId = `id người dùng phải là số nguyên dương`;
        }

        // nếu như có lỗi
        if (!commonUtil.isEmpty(error)) {
            throw new MyError(error);
        }

        return {
            error: false,
        };
    };

    validateSearchHome = (home) => {
        const {
            name,
            areaMore,
            areaLess,
            province,
            district,
            priceMore,
            priceLess,
        } = home;

        let returnResult = {};
        let error = {};

        if (!name || !NAME_REGEX.test(name)) {
            error.name = `Tên ${MESSAGE_INVALID}`;
        } else {
            returnResult.name = name;
        }

        if (!priceMore || !commonUtil.isNumber(priceMore)) {
            error.price = `giá phải là số`;
            if (priceMore < 0) {
                error.price += `giá phải lớn hơn 0`;
            }
        } else {
            returnResult.priceMore = priceMore;
        }

        if (!priceLess || !commonUtil.isNumber(priceLess)) {
            error.price = `giá phải là số`;
            if (priceLess < 0) {
                error.price += `giá phải lớn hơn 0`;
            }
        } else {
            returnResult.priceLess = priceLess;
        }

        if (province || district) {
            returnResult.address = {};
        }

        if (!province || !NAME_REGEX.test(province)) {
            error.province = `quận ${MESSAGE_INVALID}`;
        } else {
            returnResult.address.province = province;
        }

        if (!district || !NAME_REGEX.test(district)) {
            error.district = `tỉnh ${MESSAGE_INVALID}`;
        } else {
            returnResult.address.district = district;
        }

        if (!areaMore || !commonUtil.isNumber(areaMore)) {
            error.area = `diện tích phải là số`;
            if (areaMore < 0) {
                error.area += `diện tích phải lớn hơn 0`;
            }
        } else {
            returnResult.areaMore = areaMore;
        }

        if (!areaLess || !commonUtil.isNumber(areaLess)) {
            error.area = `diện tích phải là số`;
            if (areaLess < 0) {
                error.area += `diện tích phải lớn hơn 0`;
            }
        } else {
            returnResult.areaLess = areaLess;
        }

        if (areaMore > areaLess) {
            error.areaMore = `areaMore phải nhỏ hơn areaLess`;
        }

        return {
            error: false,
            home: returnResult,
        };
    };

    validatePage = function (page, pageSize) {
        if (!commonUtil.isNumber(page) || page < 0) {
            throw new MyError(`Trang ${MESSAGE_INVALID}`);
        }

        if (!commonUtil.isNumber(pageSize) || pageSize < 0) {
            throw new MyError(`Số lượng trang ${MESSAGE_INVALID}`);
        }
    };

    validateCreatorId = (creatorId) => {
        if (!creatorId || !commonUtil.isNumber(creatorId)) {
            throw new MyError(`Mã người dùng ${MESSAGE_INVALID}`);
        }

        return {
            error: false,
        };
    };

    uploadImage = async (images) => {
        let imageUrls = [];
        if (images) {
            for (let i = 1; i <= 5; i++) {
                const image = images['image' + i];
                if (image) {
                    let result = await cloudinary.addFile(image[0].path);
                    imageUrls.push(result.secure_url);
                }
            }
        }

        return imageUrls;
    };

    deleteOldImage = async (homeId, newImages) => {
        const oldImages = await Home.findOne({ _id: homeId }).image;
        const currentImage = [];
        if (oldImages) {
            for (let i = 0; i < oldImages.length; i++) {
                const oldImage = oldImages[i];
                if (!newImages.includes(oldImage)) {
                    await cloudinary.removeFiles(oldImage);
                } else {
                    currentImage.push(oldImage);
                }
            }
        }
        return { newImages: currentImage };
    };

    // validateImg = (images) => {
    //     if (!images) {
    //         throw new MyError(`Hình ảnh không được để trống`);
    //     }

    //     images.forEach((element) => {
    //         if (!element || URL_REGEX.test(element)) {
    //             throw new MyError(`Ảnh ${MESSAGE_INVALID} hoặc ${IMG_INVALID}`);
    //         }
    //     });

    //     return {
    //         error: false,
    //     };
    // };
}

module.exports = new HomeValidate();
