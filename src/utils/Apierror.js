class Apierror extends Error {
    constructor(statusCode, message = "Something went wrong",  errors = null , success = false ) {
        super(message);

        this.statusCode = statusCode;
        this.success = success;
        this.errors = errors;
    }
}

export { Apierror };