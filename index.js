var express    = require('express');
var bodyParser = require('body-parser');
var figlet     = require('figlet');
var readline   = require('readline');
var ATEM       = require('applest-atem');
var config     = require('./config.json');

var app        = express();
const options  = config.options || {};
let port       = options.port || 8080;
const switcher = config.switcher || {};
let title      = options.title || 'ATEM Control';
let channels   = [];
const atem_log = (message) => console.log('npm-atem:', message);

if (process.stdin.isTTY) {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
}

// FIGlet
console.log(figlet.textSync(title));

atem = new ATEM;
atem.event.setMaxListeners(options.max_listeners || 3);

// Conectar
if (switcher.address) {
  atem_log(`Attempting connection to ${switcher.address}...`);
  atem.connect(switcher.address);
} else {
  atem_log('ATEM switcher IP address not defined in config.json');
  atem_log('Set the switcher IP address in the config.json file, under switcher.address section.');
  process.exit(1);
}

atem.on('connect', () => {
  channels = atem.state.channels;
});

app.use(bodyParser.json());

app.get('/', express.static(__dirname + '/public'));

app.post('/api/changePreviewInput', (req, res) => {
  input = req.body.input;
  atem.changePreviewInput(input);
  res.send(`PREVIEW is now input ${input}`);
});

app.post('/api/changeProgramInput', (req, res) => {
  input = req.body.input;
  atem.changePreviewInput(input);
  res.send(`PROGRAM is now input ${input}`);
});

app.post('/api/autoTransition', (req, res) => {
  atem.autoTransition();
  res.send(`TRANSITION OK`);
});

app.post('/api/cutTransition', (req, res) => {
  atem.cutTransition();
  res.send(`CUT OK`);
});

atem.on('connect', () => {
  app.listen(port, function () {
    atem_log(`Connected to ${atem.state._pin} at ${atem.address}`);
    atem_log(`Awaiting commands in port ${port}.`);
    console.log();
    atem_log(`Press "Q" to kill the server.`);

    process.stdin.on('keypress', (str, key) => {
      if (key.name === 'q') {
        console.log();
        process.exit();
      }
    });
  });
});