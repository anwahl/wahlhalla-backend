const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var { expressjwt: jwt } = require('express-jwt');
var jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
var corsOptions = {
  origin: "*"
};
const PORT = process.env.PORT || 8080;

const db = require("./app/models");
db.sequelize.sync();


var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI
  }),
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER_BASE_URL,
  algorithms: ['RS256']
});

app.use(cors(corsOptions))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(jwtCheck)
    .get("/", (req, res) => {
        res.json({ message: "Wahlhalla" })
        })
    .listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`)
    });

require("./app/routes/assignedTask.routes")(app);
require("./app/routes/person.routes")(app);
require("./app/routes/subtask.routes")(app);
require("./app/routes/target.routes")(app);
require("./app/routes/targetType.routes")(app);
require("./app/routes/task.routes")(app);
require("./app/routes/taskType.routes")(app);

