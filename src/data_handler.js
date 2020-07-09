
const fs = require('fs');
const { resolve } = require('path');
const { logger } = require('./loggers');
const data_file="entries.json";
const cache_timeout = 3600;
const max_backup_files = 20;
const backup_dir = "entries_bkp";
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
                backupData(data_cache);
                last_cache_time = (new Date()).getTime() / 1000;
                data_cache = data;
                resolve();
            });
        });
    }
}

function getFileName(date) {
    const y = date.getFullYear();
    let m = date.getMonth()+1;
    m = numToString(m);
    let d = date.getDate();
    d = numToString(d);
    let h = date.getHours();
    h = numToString(h);
    let mins = date.getMinutes();
    mins = numToString(mins);
    let secs = date.getSeconds();
    secs = numToString(secs);
    return "" + y + "-" + m + "-" + d + "_" + h + mins + secs;
}

function numToString(n) {
    if (n < 10)
        return "0" + n;
    return "" + n;
}

async function backupData(prevData) {
    bkp_file_name = getFileName(new Date()) + ".data.bkp";
    logger.info('Creating backup ' + bkp_file_name);
    if (!fs.existsSync(backup_dir)) {
        await fs.mkdirSync(backup_dir);
    }
    await fs.writeFileSync(backup_dir + "/" + bkp_file_name, prevData, 'utf8');
    return cleanBackups();
}

async function cleanBackups() {
    fs.readdir(backup_dir, (err, files) => {
        while (files.length > max_backup_files) {
            fileToRemove = files[0];
            logger.info("Cleaning backup " + fileToRemove);
            try {
                fs.unlinkSync(backup_dir + "/" + fileToRemove);
            }
            catch(err) {
                reject("Error cleaning backup file " + fileToRemove + ". Error: " + err);
            }
            files.shift();
        }
      });
}