const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const hostname = '127.0.0.1';
const data_file="entries.json";
const port = 3333;

const corsOptions = {
    origin: 'http://localhost:5000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
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
    fs.writeFileSync(data_file, JSON.stringify(req.body), e => {
        res.sendStatus(500);
    });
    res.sendStatus(200);
});

app.listen(port, () => console.log(`calendar server listening at http://${hostname}:${port}`));