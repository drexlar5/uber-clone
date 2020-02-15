const express = require('express');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/auth');
const app = express();

let port = 3002; // mongodb+srv://taxtiapp:testtaxi@cluster0-g3vvd.mongodb.net/test?retryWrites=true&w=majority


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


require('./routes/auth')(app);
app.use('*', authMiddleware);
require('./routes/user')(app);

const mongoConnectionString = 'mongodb+srv://taxiapp:testtaxi@cluster0-g3vvd.mongodb.net/taxiapp?retryWrites=true&w=majority';

app.get('/', (req, res) => console.log('express backend for taxi API'))


app.listen(port, () => console.log(`app listening on port: ${port}`));
mongoose.connect(mongoConnectionString, {useNewUrlParser: true, useUnifiedTopology: true})
.then( resp => console.log('connected to MongoDB'));
