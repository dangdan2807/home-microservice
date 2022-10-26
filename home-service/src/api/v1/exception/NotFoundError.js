class NotFoundError extends Error {
    constructor(message) {
        super();
        this.error = true;
        this.statusCode = 404;
        this.message = `Not found: ${message}`;
    }
}

module.exports = NotFoundError;
