const { logger } = require("./loggers");

module.exports = {
    validateRequest: function (r) {
        const b64auth = (r.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
        const username = process.env.username;
        const pw = process.env.password;
        if (username === undefined || username === null || username === "" || pw === "" || pw === undefined || pw === null) {
            logger.error("User or pw is missing from request");
            return false;
        }
        if (login === username && pw === password) {
            return true;
        }
        logger.warn("Failed authentication for user " + login + "\n");
        return false;
    }
}