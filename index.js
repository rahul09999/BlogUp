const express = require("express");
const path = require("path");
require('dotenv/config');
const mongo_connect = process.env.MONGO_CONNECT;

const mongooseConnect = require("./connect");
const userRoute = require("./routes/user");

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

app.use("/user", userRoute);
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => console.log(`Server is running or port: ${PORT}`));
