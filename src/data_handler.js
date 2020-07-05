
const fs = require('fs');
const { resolve } = require('path');
const { logger } = require('./loggers');
const data_file="entries.json";
const cache_timeout = 3600;
let data_cache;
let last_cache_time;

module.exports = {
    getEntriesData: async function () {
        now = (new Date()).getTime() / 1000;
        if (data_cache != null && last_cache_time != null && now - last_cache_time <= cache_timeout ) {
            return data_cache;
        }
        logger.info("Fetching data from file (and not cache)");
        return new Promise((resolve, reject) => {
            fs.readFile(data_file, 'utf8', (err, data) => {
                if (err)
                    reject(err);
                data_cache = data;
                last_cache_time = now;
                resolve(data);
            });
        });
    },

    saveEntriesData: async function(data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(data_file, data, 'utf8', err => {
                if (err)
                    reject(err);
                data_cache = data;
                last_cache_time = (new Date()).getTime() / 1000;;
                resolve();
            });
        });
    }

}