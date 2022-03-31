const express = require("express");
const Router = express.Router();
const controller = require("../controller/main_controller");
Router.get("/magazines", controller.magazines);
Router.get("/books", controller.books);
Router.get("/authors", controller.authors);
Router.get("/addto", controller.addto);
Router.get("/add/:id", controller.add);
Router.post("/data/:id", controller.addData);
Router.post("/searchauth", controller.sauth);
Router.post("/sort", controller.Sort);
Router.get("/", controller.root);
module.exports = Router;
