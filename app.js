const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();


const app = express();
const port = 1337;

// Used with POST, PUT and DELETE when using parameters.
const bodyParser = require("body-parser");

// const hello = require('./routes/hello');
const router = require('./routes/router');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cors());

// Don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined")); // "combined" outputs Apache style LOGs
}

// // Middleware called for all routes.
// // Middleware takes three params.
// app.use((req, res, next) => {
//     console.log("Method: " + req.method);
//     console.log("Path: " + req.path);
//     console.log(req.body);
//     next();
// });

// Middleware called for all routes.
// Middleware takes three params.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

// Route imported from index.js
app.use('/', router);

app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});



// Server startup
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
