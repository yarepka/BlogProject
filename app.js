const express = require("express");
const ejs = require("ejs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// enables static files: .html, .css
app.use(express.static(path.join(__dirname, "public")));

// sets view engine as ejs
// set the default layout for all pages
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
})

app.get("/profile", (req, res) => {
  res.render("profile");
})

app.get("/community", (req, res) => {
  res.render("community");
})

app.get("/communities", (req, res) => {
  res.render("communities");
})

app.get("/blog", (req, res) => {
  res.render("blog");
})

app.get("/add-post", (req, res) => {
  res.render("add-post");
})

app.listen(PORT, console.log(`Server started on port ${PORT}`));