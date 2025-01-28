const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
//const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvYiIsInVzZXJQYXNzd29yZCI6InBhc3N3b3JkMiIsImlhdCI6MTczNzk5NzQ1OCwiZXhwIjoxNzM4MDAxMDU4fQ.etlf2UnjogKFidzjJXYVOMNRw3h47caq0k6tGZVyBXk";

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    if (authHeader) {
        
        console.log('HERE'+authHeader);
        var token = authHeader;
        
    }

    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" + token});
        }

        req.user = decoded;
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
