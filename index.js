const express = require("express");
const jwt  = require("jsonwebtoken");
const JWT_SECRET = "harsh09090909090";  //password to verify the users 
const app = express();


app.use(express.json());

function logger(req, res, next) {
   console.log(req.method + " request came");
   next();
}


const users = [];
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/signup", logger,  function(req, res) {
    console.log("request body: ", req.body);
    const username = req.body.username;
    const password = req.body.password;
    users.push({
        username: username,
        password: password
    })
    res.json({
        message: "you have signed up"
    })
    console.log(users)
})
app.post("/signin", logger,  function(req, res) {
    const username = req.body.username;
    const password  = req.body.password;
    let foundUser = null;

    for(let i = 0; i<users.length; i++) {
        if(users[i].username === username && users[i].password === password) {
            foundUser = users[i];
        } 
        else {
            res.json({
                message : "credinatials are incorrect"
            })
        }
        const token = jwt.sign({
            username: users[i].username,
        
        }, JWT_SECRET);
        res.json({
            token: token
        })
    }
    console.log(users);
})

function auth(req, res, next) {
    const token = req.headers.token;
    const decodedInfo = jwt.verify(token, JWT_SECRET);
    if(decodedInfo.username) {
        req.username = decodedInfo.username; // modify the requst object to use username in /me endpoint
       next();
    }
    else {
        res.json({
            message : "User not found"
        })
    }
}

app.get("/me",logger,  auth, function(req, res) {
    // const token = req.headers.token;
    // const decodedInfo = jwt.verify(token, JWT_SECRET);

   
        let foundUser =  null;
        for(let i=0; i<users.length; i++) {
            if(users[i].username === req.username) { //auth pass the userrnme 
                foundUser = users[i];
            }
        }
        if(!foundUser) {
            res.status(404).json({
                error: "user not found"
            });
        }
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
        


    

})
app.listen(3000);