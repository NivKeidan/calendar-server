module.exports = {
    validateRequest: function (r) {
        const b64auth = (r.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
        process.stdout.write("validating request...");
        const username = process.env.username;
        const pw = process.env.password;
        if (username === undefined || username === null || username === "" || pw === "" || pw === undefined || pw === null) {
            process.stdout.write("no such user, pw is missing or empty\n");
            return false;
        }
        if (login === username && pw === password) {
            process.stdout.write("Success for user " + login + "\n");
            return true;
        }
        process.stdout.write("Failure for user " + login + "\n");
        return false;
    }
}