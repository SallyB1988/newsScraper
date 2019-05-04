var express = require("express");
var exphbs = require("express-handlebars");

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
// Make public a static folder -- this uses index.html as default
app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });


  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  console.log('inside scraper');
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
          // View the added result in the console - this is slow
          // console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      });
      // console.log(articlesData.length);
      return(articlesData.length)
    })
    .then(function(num) {
      res.send(`${num} articles found`)
      // res.render("/", );
    })
  });

// Routes for ARTICLES ==================================

// Get all articles
app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle) {
    res.send(dbArticle);
  })
  .catch(function(err) {
    res.send(err);
  });
});

// Get one specific article
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .populate("notes")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// POST update saved value of specific article
app.post("/articles/:id", function(req, res) {
  console.log("=============================");
  console.log(req.params.id);
  db.Article.findOneAndUpdate({ _id: req.params.id }, {$set: {"saved": true }}, { new: true })
  .then(function(data) {
    res.json(data);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Routes for SAVED articles =========================
// Get all saved articles
app.get("/saved", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle) {
    res.render("SavedArticles", dbArticle);
  })
  .catch(function(err) {
    res.send(err);
  });
});

// Get one specific saved article
app.get("/saved/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .populate("notes")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// POST a note on a specific saved article
app.post("/saved/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { notes: dbNote._id }}, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});






// Routes for NOTES ==================================

// Get all notes
app.get("/notes", function(req, res) {
  db.Note.find({})
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.send(err);
  });
});

// Get one specific note
app.get("/notes/:id", function(req, res) {
  db.Note.findOne({ _id: req.params.id })
  .then(function(data) {
    res.json(data);
  })
  .catch(function(err) {
    res.json(err);
  });
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port " + PORT + "!");
});
