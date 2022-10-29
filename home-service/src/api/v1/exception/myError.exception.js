class MyError extends Error {
    constructor(message) {
        super();
        this.error = true;
        this.statusCode = 400;
        this.message = message;
    }
}

module.exports = MyError;
