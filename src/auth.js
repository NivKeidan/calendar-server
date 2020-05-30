const fs = require('fs');

module.exports = {
    validateRequest: function (r, successFn, failFn) {
        const b64auth = (r.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
        process.stdout.write("validating request...");
        fs.readFile(process.env.creds_file, 'utf8', (err, data) => {
            if (err) {
                process.stdout.write("Error reading credentials: ", err)
                process.stdout.write("\n");
                failFn();
                return;
            }
            let creds = JSON.parse(data);
            if (creds === undefined || creds === null) {
                process.stdout.write("failed parsing creds file");
                process.stdout.write("\n");
                failFn();
                return;
            }
            const pw = creds[login];
            if (pw === undefined || pw === null || pw === "") {
                process.stdout.write("no such user, pw is missing or empty\n")
                failFn();
                return;
            }
            if (pw === password) {
                process.stdout.write("Success for user " + login + "\n");
                successFn();
                return;
            }
            process.stdout.write("Failure for user " + login + "\n");
            failFn();
        });
    }
}