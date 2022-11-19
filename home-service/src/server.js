require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const useragent = require('express-useragent');

const eurekaConfig = require('./config/eureka.config');
const handleErr = require('./api/v1/middleware/handleErr');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('common'));
app.use(cors());
app.use(cookieParser());
app.use(useragent.express());

const db = require('./config/db.config');
db.connect();

const routes = require('./api/v1/routes/index.route');
routes(app);
app.use(handleErr);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

// eurekaConfig.registerWithEureka(PORT);