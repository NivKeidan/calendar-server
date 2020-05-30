const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cool = require('cool-ascii-faces');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
let authModule = require('./auth');
require('dotenv').config();

const data_file="entries.json";
const hostname = process.env.server_url;
const client_origin = process.env.client_origin;
const port = process.env.PORT || 3333;

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
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.options('/', cors());

app.get('/cool', (req, res) => res.send(cool()))

app.get('/', (req, res) => {
    if (!authModule.validateRequest(req))
        res.status(401).send('Authentication Failed');
    else {
        fs.readFile(data_file, 'utf8', (err, data) => {
            if (err)
                res.status(500).send("error reading data file");
            else
                res.status(200).set('Content-Type', 'application/json').send(data);
        });
    }
});

app.post('/', function (req, res) {
    if (!authModule.validateRequest(req))
        res.status(401).send('Authentication Failed');
    else {
        fs.writeFileSync(data_file, JSON.stringify({timestamp: Date.now(), data: req.body}), e => {
            res.sendStatus(500);
        });
        res.sendStatus(200);
    }
});

app.listen(port, () => console.log(`calendar server listening at ${hostname}:${port}`));