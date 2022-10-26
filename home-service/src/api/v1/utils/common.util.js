class CommonUtil {
    isEmpty = (obj) => {
        if (!obj) {
            return true;
        }
        return Object.keys(obj).length === 0;
    };

    isNumber = (value) => {
        return !isNaN(value);
    };
}

module.exports = new CommonUtil();
