let dataModule = require('./data_handler');
const { logger } = require('./loggers');
const fs = require('fs');
const backup_dir = "entries_bkp"

module.exports = {
    createDataBackup: function() {
        const now = new Date();
        const fileName = getFileName(now);
        const filePath = backup_dir + "/" + fileName;

       logger.info('Back-up func running. Target file: ' + filePath);
        if (!fs.existsSync(backup_dir)) {
            fs.mkdirSync(backup_dir);
        }

        dataModule.getEntriesData()
        .then( d => {
            try {
                fs.writeFileSync(filePath, d, 'utf8')
                logger.info("Backed up data successfully");
            } catch (e) {
                logger.warning("Failed saving backup. error: " + e.message);
            }
        }).catch( e => {
            logger.warning("Failed saving backup. error: " + e.message);
        })
    }
};

function getFileName(date) {
    const y = date.getFullYear();
    let m = date.getMonth()+1;
    m = numToString(m);
    let d = date.getDay();
    d = numToString(d);
    let h = date.getHours();
    h = numToString(h);
    let mins = date.getMinutes();
    mins = numToString(mins);
    let secs = date.getSeconds();
    secs = numToString(secs);
    return "" + y + "-" + m + "-" + d + ":" + h + mins + secs;
}

function numToString(n) {
    if (n < 10)
        return "0" + n;
    return "" + n;
}