const express = require('express')
const path = require("path");
const userRoute = require("./routes/user")

const app = express();
const PORT = 8000;

app.set("view engine", "ejs")
app.set('views', path.resolve('./views'));

app.use('/user', userRoute);
app.get('/', (req, res)=> {
    res.render('home')
})


app.listen(PORT, ()=> console.log(`Server is running or port: ${PORT}`));