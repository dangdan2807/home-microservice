class CommonUtil {
    isEmpty = (obj) => {
        if (!obj) {
            return true;
        }
        return Object.keys(obj).length === 0;
    };

    isNumber = (value) => {
        return !(isNaN(value) && value !== 0);
    };

    getPagination = (page, size, total) => {
        const totalPages = Math.ceil(total / size);
        const skip = page * size;
        return {
            skip,
            limit: size,
            totalPages,
        };
    };
}

module.exports = new CommonUtil();
