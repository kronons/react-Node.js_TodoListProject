const express = require("express");
const bodyParser = require("body-parser");
const cors =  require("cors");
const app = express();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const dbAccount = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'kongmeng',
    database: 'accounts',
});

app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'GET'],
    credentials: true
}));

app.post('/register', (req, res) => {
    
    const username = req.body.username
    const password = req.body.password
    const listId = crypto.randomBytes(16).toString("hex");

    dbAccount.query("INSERT INTO login (username, password, listId) VALUES (?, ?, ?)", 
    [username, password, listId], (err, result) => {
        console.log(err);
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const token = jwt.sign({username}, "our-json-webtoken-secret-key", {expiresIn: '1d'});

    dbAccount.query("SELECT * FROM login WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            } else if (result.length > 0) {
                res.cookie('token', token);
                res.send(result);
            } else {
                res.send({ error: "Invalid username/password combination" });
            }
        }
    );
});

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'kongmeng',
    database: 'todolist',
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Message: "Error: No token found. To get token, plese login."})
    } else {
        jwt.verify(token, "our-json-webtoken-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Message: "Authentication error: token incorret. Please relog."})
            } else {
                req.username =  decoded.username;
                next();
            }
        })
    }
}

app.get('/api/get', verifyUser, (req, res) => {
    const listId = req.query.listId;
    const sqlSelect = "SELECT * FROM todo WHERE listId = ?";
    db.query(sqlSelect, [listId], (err, result) => {
        if (err) {
            return res.status(500).json({ Status: "Error", Error: err });
        }
        const todos = result.map(todo => ({ id: todo.id, title: todo.title, completed: todo.completed }));
        return res.status(200).json({ Status: "Success", todos, name: req.username });
    });
});

app.post("/api/insert", (req, res) => {

    const newItem = req.body.newItem;
    const id = req.body.id;
    const listId = req.body.listId;

    const sqlInsert = "INSERT INTO todo (listId, idRandom, title) VALUES (?, ?, ?)";
    
    db.query(sqlInsert, [listId, id, newItem], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error inserting data");
        } else {
            console.log(result);
            res.send("Data inserted successfully");
        }
    });
});

app.post("/api/modify", (req, res) => {

    const id = req.body.id;
    const newItem = req.body.newItem;

    const sqlUpdate = "UPDATE todo SET title = ? WHERE id = ?";

    db.query(sqlUpdate, [newItem, id], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error inserting data");
        } else {
            console.log(result);
            res.send("Data inserted successfully");
        }
    });
});

app.post("/api/delete", (req, res) => {

    const id = req.body.id;

    const sqlUpdate = "DELETE FROM todo WHERE idRandom = ?";

    db.query(sqlUpdate, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error inserting data");
        } else {
            console.log(result);
            res.send("Data inserted successfully");
        }
    });
});

/* Testing database code
app.get('/', (req, res) => {
      
    const sqlInsert = "INSERT INTO todo (todoitems) VALUES ('homework')";
    db.query(sqlInsert, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error inserting data");
        } else {
            console.log(result);
            res.send("Data inserted successfully");
        }
    })
    
});
*/

app.listen(5174, () => {
    console.log("running on port 5174");
});