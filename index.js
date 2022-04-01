const express = require("express");
const app = express();
const Router = require("./routes/router");
const path = require("path");
app.set(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");
app.get("/", Router);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(Router);
app.listen(process.env.PORT || 3000, () => {
  console.log(`server live on ${process.env.PORT | 3000}`);
});
