const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const authenticate = require('./middlewares/authenticate.js');
const app = express();
const port = process.env.PORT || 9999;
const folderNameLength = __dirname.split('').reverse().indexOf('/');
const appDirectory = __dirname.slice(0, __dirname.length - folderNameLength - 1); //base app directory

app.use(compression());
app.use(express.static(appDirectory + '/client'));
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({type: 'application/x-www-form-urlencoded', extended: true}));
app.use(authenticate);



app.get('*', (request, response) => {
  response.sendFile(`${appDirectory}/client/index.html`);
});

app.listen(port, () => {
  console.log(`Web Server Listening on port ${port}`);
});