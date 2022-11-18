class NotFoundError extends Error {
    constructor(message) {
        super();
        this.error = true;
        this.status = 404;
        this.message = `Not found: ${message}`;
    }
}

module.exports = NotFoundError;
