const express = require("express");
const cors = require("cors");
const morgan = require("morgan");


const app = express();
const bodyParser = require("body-parser");

const port = 1337;

const hello = require('./routes/hello');

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
    // use morgan to log at command line
    app.use(morgan("combined")); // "combined" outputs Apache style LOGs
}

// Middleware called for all routes.
// Middleware takes three params.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

// Routes
// app.get("/", (req, res) => {
//     const data = {
//         data: {
//             msg: "Hej Bilbo"
//         }
//     };
//
//     res.json(data);
// });

// Route imported from hello.js
app.use('/', hello);

app.get("/hello/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
});

app.get("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request"
        }
    });
});

app.post("/user", (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Created"
        }
    });
});

app.put("/user", (req, res) => {
    res.status(204).send();
});

app.delete("/user", (req, res) => {
    res.status(204).send();
});

app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if(res.headerSent) {
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

// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.json());
