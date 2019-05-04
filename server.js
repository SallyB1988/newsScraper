var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Use morgan for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });


app.get("/", function(req, res) {
  res.render("index");
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios.get("http://www.echojs.com/").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    let articlesData = $("article h2");
    articlesData.each(function(i, element) {
      let article = {};
      // Add the text and href of every link, and save them as properties of the result object
      article.title = $(element).children("a").text();
      article.link = $(element).children("a").attr("href");
      // Create a new Article using the `article` object built from scraping
      db.Article.create(article)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      });
      // console.log(articlesData.length);
      // return(articlesData.length)
    })
    .then(
      db.Article.find()
      .then(function(articles) {
        console.log(articles.length);
        res.send(articles.length)
      })
      )
      res.send("Articles Scraped");
    // res.render("index");
  });

// Get all articles
app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
    // console.log(dbArticle);
    res.send(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.send(err);
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port " + PORT + "!");
});
