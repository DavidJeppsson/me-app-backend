var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.get("/", (req, res, next) => {
    console.log(process.env.JWT_SECRET);
    db.get("SELECT content FROM presentation WHERE version = 1",
    (err, row) => {
        if(err) {
            return res.status(500).json({
                data: [
                    {
                        status: err.status,
                        title: "Internal Server Error",
                        detail: err.message
                    }
                ]
            });
        }

        if (!row) {
            return res.status(404).json({
                data: {
                    status: 404,
                    title: "Not found"
                }
            })
        }

        return res.status(200).json({
            data :  [
                {
                    status: 200,
                    text: row.content
                }
            ]
        });
    }
)
});

router.get("/reports/week/:id", (req, res, next) => {
    let id = req.params.id;

    db.get(
        "SELECT content FROM report WHERE kmom = ?", [id],
    (err, row) => {
        if(err) {
            return res.status(500).json({
                data: [
                    {
                        status: err.status,
                        title: "Internal Server Error",
                        detail: err.message
                    }
                ]
            });
        }

        if (!row) {
            return res.status(404).json({
                data: {
                    status: 404,
                    title: "Not found"
                }
            })
        }
        return res.status(200).json({
            data: {
                status: 200,
                text: row.content
            }
        });
    });

});

router.post("/register", (req, res, next) => {
    const saltRounds = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const email = req.body.email;

    db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
    email,
    hash,
    (err) => {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: err.status,
                    title: "Internal Server Error",
                    detail: err.message
                }
            });
        }

        res.status(201).json({
            data: {
                msg: "Created user"
            }
        });
    });
});


router.post("/login", (req, res, next) => {
    db.get(
        "SELECT * FROM users WHERE email = ?",
        [req.body.email],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    data: {
                        status: err.status,
                        title: "Internal Server Error",
                        detail: err.message
                    }
                });
            }

            if(!row) {
                return res.status(404).json({
                    data: {
                        status: 404,
                        title: "User not found"
                    }
                });
            }

            if (!bcrypt.compareSync(req.body.password, row.password)) {
                return res.status(404).json({
                    data: {
                        status: 404,
                        title: "Login failed, check password"
                    }
                });
            }

            if (bcrypt.compareSync(req.body.password, row.password)) {

                const payload = { email: req.body.email };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, { expiresIn: "1h" });

                const data = {
                    data: {
                        status: 200,
                        msg: "Login succeeded",
                        token: token

                    }
                };

                return res.json(data);
            }
        }
    )
});

router.post("/reports",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => {
        console.log(req.body);
        db.run(
            "INSERT INTO report (kmom, content) VALUES (?, ?)",
            req.body.kmom,
            req.body.content,
        (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Internal Server Error",
                        detail: err.message
                    }
                });
            }
            res.status(201).json({
                data: {
                    status: 201,
                    msg: "Report added."
                }
            });
        });
    }
);

// router.post("/reports", (req, res, next) =>
//     checkToken(req, res, next),
//     (req, res) => {
//
//         console.log(req.body);
//         db.run(
//             "INSERT INTO report (kmom, content) VALUES (?, ?)",
//             req.body.content,
//             req.body.kmom,
//             (err) => {
//                 if (err) {
//                     return.res.status(500).json({
//                         data: {
//                             status: err.status,
//                             title: "Internal Server Error",
//                             detail: err.message
//                         }
//                     });
//                 }
//
//                 res.status(201).json({
//                     data: {
//                         status: 201,
//                         msg: "Report added"
//                     }
//                 });
//             };
//         )
//     }
// );

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).json({
                data: {
                    status: 500,
                    title: "Internal Server Error",
                    detail: err.message
                }
            });
        }
        
        next();
    });
}

module.exports = router;


// router.post("/login", (req, res, next) => {
//     db.get(
//         "SELECT * FROM users WHERE email = ?",
//         [req.body.email],
//         (err, row) => {
//             if (err) {
//                 return res.status(500).json({
//                     data: {
//                         status: err.status,
//                         title: "Internal Server Error",
//                         detail: err.message
//                     }
//                 });
//             }
//
//             if(!row) {
//                 return res.status(404).json({
//                     data: {
//                         status: 404,
//                         title: "User not found"
//                     }
//                 });
//             }
//
//             if (!bcrypt.compareSync(req.body.password, row.password)) {
//                 return res.status(404).json({
//                     data: {
//                         status: 404,
//                         title: "Login failed, check password"
//                     }
//                 });
//             };
//
//
//             const payload = { email: req.body.email };
//             const secret = process.env.JWT_SECRET;
//             const token = jwt.sign(payload, secret, { expiresIn: "1h" });
//
//             const data = {
//                 data: {
//                     status: 200,
//                     msg: "Login successful.",
//                     token: token
//                 }
//             };
//
//            return res.json(data);
//        });
// });








// app.get("/hello/:msg", (req, res) => {
//     const data = {
//         data: {
//             msg: req.params.msg
//         }
//     };
//
//     res.json(data);
// });
//
// app.get("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a GET request"
//         }
//     });
// });
//
// app.post("/user", (req, res) => {
//     res.status(201).json({
//         data: {
//             msg: "Got a POST request, sending back 201 Created"
//         }
//     });
// });
//
// app.put("/user", (req, res) => {
//     res.status(204).send();
// });
//
// app.delete("/user", (req, res) => {
//     res.status(204).send();
// });
