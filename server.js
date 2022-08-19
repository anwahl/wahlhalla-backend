if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const schedule = require('node-schedule');
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
var corsOptions = {
  origin: "*"
};
const PORT = process.env.PORT || 8080;

const db = require("./app/models");
db.sequelize.sync();

app.use(cors(corsOptions))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get("/", (req, res) => {
        res.json({ message: "Welcome to Wahlhalla!" })
        })
    .listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`)
    });


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
    const job = schedule.scheduleJob('30 13 * * *', function(){
        const AssignedTask = db.assignedTasks;
        const Task = db.tasks;
        const Target = db.targets;
        const TaskType = db.taskTypes;
        const Person = db.persons;

        const dueDate = new Date();
        const complete = 0;
        var condition = { dueDate: dueDate, complete: complete };
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
              if (due != null && due != undefined && due != '') {
                let message = `From Wahlhalla, due today:\r\n${Array.isArray(due) ? due.join('\r\n') : due}`;
                process.env.TO_NUMBER.split(',').forEach(num => {
                  twilio.messages.create({
                    body: message,
                    from: process.env.FROM_NUMBER,
                    to: num
                  }).then(message => console.log(message.body));
                });
              } else {
                let message = "No tasks today. Enjoy yor day!"
                process.env.TO_NUMBER.split(',').forEach(num => {
                  twilio.messages.create({
                    body: message,
                    from: process.env.FROM_NUMBER,
                    to: num
                  }).then(message => console.log(message.body));
                });
              }
        })
        .catch(err => {
            console.log(err);
            process.env.TO_NUMBER.split(',').forEach(num => {
                twilio.messages.create({
                  body: "Error retrieving today's due tasks. Error: " + err,
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

