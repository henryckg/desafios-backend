import ErrorEnum from "../services/errors/error.enum.js";

export const ErrorHandler = (error, req, res, next) => {
    switch (error.code) {
        case ErrorEnum.INVALID_TYPE_ERROR:
            req.logger.fatal(error.cause)
            return res.status(400).send({ error: error.name });
        case ErrorEnum.DATABASE_ERROR:
            req.logger.fatal(error.cause)
            return res.status(400).send({ error: error.name });
        case ErrorEnum.INVALID_ID_ERROR:
            req.logger.error(error.cause)
            return res.status(404).send({ error: error.name });
        case ErrorEnum.ROUTING_ERROR:
                return res.status(404).send({ error: error.name });
        default:
            console.log('Error: ' + error.message)
            return res.status(400).send({ error: "Unhandled error" });
    }
};