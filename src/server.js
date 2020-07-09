const express = require('express');
const https = require('https');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

// app modules
const authModule = require('./auth');
const dataModule = require('./data_handler');
const { logger } = require('./loggers');

const hostname = process.env.server_url;
const client_origin = process.env.client_origin;
const port = process.env.PORT || 3333;

let latestTimestamp = 0;

const corsOptions = {
    origin: client_origin,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(helmet());
app.use(compression()); //Compress all routes
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.options('/', cors());

app.get('/', (req, res) => {
    if (!authModule.validateRequest(req))
        res.status(401).send('Authentication Failed');
    else {
        dataModule.getEntriesData()
        .then( data => {
            res.status(200).set('Content-Type', 'application/json').send(data);
            latestTimestamp = JSON.parse(data).timestamp;
        }).catch( err => {
            logger.error("Failed getting data. Error: " + err.message);
            res.status(500).send(err.message);
        });
    }
});

app.post('/', function (req, res) {
    if (!authModule.validateRequest(req))
        res.status(401).send('Authentication Failed');
    else {
        if (req.body.timestamp < latestTimestamp) {
            logger.error("Failed saving data. Stored data is newer than requested data");
            res.status(400).send('Stored data is newer');
        }
        dataModule.saveEntriesData(JSON.stringify(req.body))
        .then(() => {
            res.sendStatus(200);
        }).catch( e => {
            logger.error("Failed saving data. Error: " + err.message);
            res.status(500).send(e.message);
        })
    }
});

if (hostname.startsWith("https")) {
    const httpsOptions = {
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/cert.pem')
    };
    let httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(port, () => logger.info(`calendar secured server listening at ${hostname}:${port}`));
}
else
    app.listen(port, () => logger.info(`calendar server listening at ${hostname}:${port}`));