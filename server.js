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
// mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });
var MONGODB_URI = "mongodb://heroku_4bmg1nff:vpgpa70q8g15tjpg6ice9viutl@ds151876.mlab.com:51876/heroku_4bmg1nff" || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// Load index page
app.get("/", function(req, res) {
  db.Article.find()
  .then(function(dbArticle) {
    res.render("index", { data: dbArticle } );
  })
  .catch(function(err) {
    res.send(err);
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request via axios for the news section of the New York Times
  // document.getElementById("#articles").innerHTML("Scraping Articles... please wait...")
  axios.get("https://www.nytimes.com/").then(function(response) {

    // Load the Response into cheerio and save it to the $ variable
    var $ = cheerio.load(response.data);

    $("div.css-6p6lnl").each(function(i, element) {
      let article = {};
      article.title = $(element).find('h2').text();     
      article.link = "https://www.nytimes.com" + $(element).children().attr("href");
  
      article.summary = $(element).find('li').text();
      if (article.summary == '') {  // Some summaries are in paragraph tags instead of li
        article.summary = $(element).find('p').text();
      }

      // Create a new Article using the `article` object built from scraping
      db.Article.create(article)
        .then(function(dbArticle) {
          // console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
      });
      })
      .then(function() {
      res.send(`Articles Scraped`)
      })

  });

// Routes for ARTICLES ==================================

// Get all articles
app.get("/articles", function(req, res) {
  db.Article.find()
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
  db.Article.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
  // db.Article.findOneAndUpdate({ _id: req.params.id }, {$set: {"saved": true }}, { new: true })
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

  db.Article.find({saved: true})
  .then(function(dbArticle) {
    res.render("SavedArticles", { data: dbArticle } );
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
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
         {$push: { notes: dbNote._id }},
         { new: true }
        );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// POST to update a note on a specific saved article
app.post("/saved/:articleId/:noteId", function(req, res) {
  db.Note.updateOne( { _id: req.params.noteId }, req.body, { upsert: true })
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.articleId },
         {$push: { notes: dbNote._id }},
         { new: true }
        );
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
  .then(function(dbNotes) {
    console.log(dbNotes);
    res.json(dbNotes)
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Delete one specific note
app.delete("/notes/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id })
  .then(function(dbNotes) {
    console.log('deleted: ' + dbNotes);
    res.send(dbNotes);
  })
  .catch(function(err) {
    res.json(err);
  });
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port " + PORT + "!");
});
