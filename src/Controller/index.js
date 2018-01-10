var express = require("express");
var app = express.Router();
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
});

app.get("/success", function(req, res) {
    res.sendFile(path.join(__dirname, "../../public/success.html"));
});

module.exports = app;