
const fs = require('fs');
const data_file="entries.json";

module.exports = {
    getEntriesData: async function () {
        return new Promise((resolve, reject) => {
            fs.readFile(data_file, 'utf8', (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    },

    saveEntriesData: async function(data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(data_file, data, 'utf8', err => {
                if (err)
                    reject(err);
                resolve();
            });
        });
    }

}