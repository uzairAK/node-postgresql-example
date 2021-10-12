require('dotenv').config();
const express = require('express'),
app = express(),
session = require("express-session");
const { Pool } = require('pg');
var port = process.env.PORT || 3000;

const sqlconfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'uzair123',
    database: 'node-postgresql-example',
    port: 5432
};
const pool = new Pool(sqlconfig);

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(function(req, res, next) {    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Session config
app.use(session({ resave: false, saveUninitialized: false, secret: "hello" }));

// Routes

// app.use(require('./routes/index'));

app.get("/", (req,res) => {
    res.json("Postgresql")
})

app.get("/login", async function requestHandler(req, res) {
    const {
      rows: [user],
    } = await pool.query(
      `SELECT * FROM users WHERE email = '${req.query.username}' and password = '${req.query.password}'`
    );
  
    if (!user) {
      res.sendStatus(401);
      return;
    }
  
    req.session.userId = user.id;
    res.send(user);
});

app.get("/getCurrentUser", (req,res) => {
    var user = req.session.userId;
    res.json(user);
});

app.get("/logout", (req,res) => {
    req.session.destroy(err => {
        if(!err) {
            res.sendStatus(200);
            return;
        }
        res.sendStatus(200);
    });
});

app.listen(port, () => {
    console.log('Server on port', port);
});


// async function requestHandler() {
//     username = "abc@gmail.com";
//     password = "12345";
//     const {
//         rows: [user],
//       } = await pool.query(
//         `SELECT * FROM users WHERE email = '${username}' and password = '${password}'`
//     );
//     console.log(user);
  
//     if (!user) {
//       res.sendStatus(401);
//       return;
//     }
// };

// requestHandler();

// const {
//     rows: [now],
//   } = await pool.query(
//     `SELECT NOW()`
//   );

// pool.query('SELECT NOW()', (err, res) => {
//     console.log(err, res)
//     pool.end()
//   })