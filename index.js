const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
require('dotenv/config');
const mongo_connect = process.env.MONGO_CONNECT;

const mongooseConnect = require("./connect");
const userRoute = require("./routes/user");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// console.log(mongo_connect)
mongooseConnect(`${mongo_connect}/BlogUp`)
.then(() => console.log("MongoDb is connected..."))
.catch((err) => {
    console.log(err);
});

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));// get token payload in req.user after validation



app.use("/user", userRoute);
app.get("/", (req, res) => {
    // console.log(req.user);
    return res.render("home", {
        user: req.user, //pass payload which we got from checkForAuthenticationCookie
    })
})
// app.get("/", (req, res) => {
//   res.render("home");
// });

app.listen(PORT, () => console.log(`Server is running or port: ${PORT}`));


//todo-
//create token when any user do signup too
//when go to signup route -> check for token and if it matchs with db user then go to home, if no token then render singup page
