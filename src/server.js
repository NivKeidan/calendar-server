const express = require('express');
var cors = require('cors');
var compression = require('compression');
var helmet = require('helmet');
const bodyParser = require('body-parser');
const fs = require('fs');
const hostname = 'https://dry-falls-97387.herokuapp.com/';
const data_file="entries.json";
const port = 80;

const corsOptions = {
    origin: 'http://localhost:5000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(helmet());
app.use(compression()); //Compress all routes
app.use(cors(corsOptions));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    fs.readFile(data_file, 'utf8', (err, data) => {
        if (err) {

            res.status(500).send("error reading data file");
            return;
        }
        res.status(200).set('Content-Type', 'application/json').send(data);
    });
});

app.options('/', cors());

app.post('/', function (req, res) {
    fs.writeFileSync(data_file, JSON.stringify({timestamp: Date.now(), data: req.body}), e => {
        res.sendStatus(500);
    });
    res.sendStatus(200);
});

app.listen(port, () => console.log(`calendar server listening at http://${hostname}:${port}`));