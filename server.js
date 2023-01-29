if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require("express");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const schedule = require('node-schedule');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const { SendMailClient } = require("zeptomail");
let client = new SendMailClient({url: process.env.ZEPTOMAIL_URL, token: "Zoho-enczapikey " + process.env.ZEPTOMAIL_TOKEN});
var corsOptions = {
  origin: "*"
};
const PORT = process.env.PORT || 8080;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Wahlhalla: Task Tracking API',
    version: '0.0.1',
  },
};
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./app/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const db = require("./app/models");
const { Op } = require('sequelize');
db.sequelize.sync();

/** Test comment. */
app.use(cors(corsOptions))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get("/", (req, res) => {
        res.json({ message: "Welcome to Wahlhalla!" })
        })
    .listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`)
    });

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV === 'production') {
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
    app.use(jwtCheck)
}


if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({
          app,
        }),
      ],
      tracesSampleRate: 1.0,
    });
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
    app.use(Sentry.Handlers.errorHandler());
  }
  
if (process.env.NODE_ENV === 'production') {
    const job = schedule.scheduleJob('30 14 * * *', function(){
        const AssignedTask = db.assignedTasks;
        const Task = db.tasks;
        const Target = db.targets;
        const TaskType = db.taskTypes;
        const Person = db.persons;

        const dueDate = new Date();
        const complete = 0;
        var condition = { dueDate: {[Op.or]: {[Op.lt]: dueDate, [Op.eq]: dueDate}}, complete: complete };
        AssignedTask.findAll({ where: condition, include: [{
                                model: Task,
                                required: true, include: [{
                                        model: Target,
                                        required: true}, {
                                        model: TaskType,
                                        required: true,
                                    }]}, {
                                model: Person,
                                required: false
                                    }], order: ['timeOfDay']})
        .then(data => {
            let due = [];
            if (Array.isArray(data)){
                data.forEach(element => {
                  due.push( `${element.task.taskType.category} : ${element.timeOfDay ? '(' + element.timeOfDay + ')' : ''} ${element.task.description} => ${element.task.target.description}`);
                });
              } else {
                  due.push(`${data.task.taskType.category} : ${data.timeOfDay ? '(' + data.timeOfDay + ')' : ''} ${data.task.description} => ${data.target.description}`);
              }
              let message = "message";
              if (due != null && due != undefined && due != '') {
                message = `From Wahlhalla, due today:<br/>${Array.isArray(due) ? due.join('<br/>') : due}`;
              } else {
                message = "No tasks today. Enjoy your day!"
              }
              console.log(process.env.TO_ADDRESS + " + " + process.env.TO_NUMBER + " + " + process.env.ZEPTOMAIL_URL);
              process.env.TO_ADDRESS.split(',').forEach(address => {
                client.sendMail({
                    "bounce_address": process.env.BOUNCE_ADDRESS,
                    "from": 
                    {
                        "address": process.env.FROM_ADDRESS,
                        "name": "Wahlhalla"
                    },
                    "to": 
                    [
                        {
                        "email_address": 
                            {
                                "address": address,
                                "name": address
                            }
                        }
                    ],
                    "subject": "Tasks Due Today",
                    "htmlbody": "<div><b>" + message + "</b></div>",
                }).then((resp) => console.log("success:" + message)).catch((error) => console.log("error : " + error));
              });
        })
        .catch(err => {
            console.log(err);
            process.env.TO_NUMBER.split(',').forEach(num => {
                twilio.messages.create({
                  body: "Error retrieving todays due tasks. Error: " + err,
                  from: process.env.FROM_NUMBER,
                  to: num
                }).then(message => console.log(message.body));
              });
        });
    });
}

require("./app/routes/assignedTask.routes")(app);
require("./app/routes/person.routes")(app);
require("./app/routes/subtask.routes")(app);
require("./app/routes/target.routes")(app);
require("./app/routes/targetType.routes")(app);
require("./app/routes/task.routes")(app);
require("./app/routes/taskType.routes")(app);

