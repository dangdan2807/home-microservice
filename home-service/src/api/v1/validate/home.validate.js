const Home = require('../models/home.model');
const commonUtil = require('../utils/common.util');
const MyError = require('../exception/MyError');

const MESSAGE_INVALID = 'không hợp lệ';
const NAME_REGEX = /\w{1,255}/;

class HomeValidate {
    validateHome = (home) => {
        const { name, address, price, area, creatorId } = home;
        const { street, province, district } = address;
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
            error.price = `giá phải là số, `;
            if (price < 0) {
                error.price += `giá phải lớn hơn 0`;
            }
        }

        if (!area || !commonUtil.isNumber(area)) {
            error.area = `diện tích phải là số, `;
            if (area < 0) {
                error.area += `diện tích phải lớn hơn 0, `;
            }
        }

        if (!creatorId || !commonUtil.isNumber(creatorId)) {
            error.creatorId = `mã người dùng phải là số, `;
        }

        // nếu như có lỗi
        if (!commonUtil.isEmpty(error)) {
            return new MyError(error);
        }

        return {
            error: false,
        };
    };

    validateSearchHome = (home) => {
        const { name, areaMore, areaLess, province, district, priceMore, priceLess } = home;

        let returnResult = {};
        let error = {};

        if (!name || !NAME_REGEX.test(name)) {
            error.name = `Tên ${MESSAGE_INVALID}`;
        } else {
            returnResult.name = name;
        }

        if (!priceMore || !commonUtil.isNumber(priceMore)) {
            error.price = `giá phải là số, `;
            if (priceMore < 0) {
                error.price += `giá phải lớn hơn 0`;
            }
        } else {
            returnResult.priceMore = priceMore;
        }

        if (!priceLess || !commonUtil.isNumber(priceLess)) {
            error.price = `giá phải là số, `;
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
            error.areaMore = `areaMore phải nhỏ hơn areaLess, `;
        }

        return {
            error: false,
            home: returnResult,
        };
    };

    validatePage = (page, pageSize) => {
        if (!page || !commonUtil.isNumber(page)) {
            return new MyError(`Trang ${MESSAGE_INVALID}`);
        }

        if (!pageSize || !commonUtil.isNumber(pageSize)) {
            return new MyError(`Số lượng ${MESSAGE_INVALID}`);
        }

        return {
            error: false,
        };
    };
}

module.exports = new HomeValidate();
