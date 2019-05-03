var cheerio = require("cheerio");
var axios = require("axios");

console.log("Getting headlines from The Washington Post");

axios.get("https://www.washingtonpost.com/").then(function(resp) {
  var $ = cheerio.load(resp.data);

  var results = [];

  $("div.headline").each(function(i, element) {
    // Save the text of the child of the h2-tag with class 'title' as "title"
    let parent = $(element).parent();

    var title = $(element).children().text();
    console.log(title);

    var link = $(element).children().attr("href");
    console.log(link);
    // console.log(title);

    // var link = $(element).children().attr("href");
    // // console.log(link);

    // // Make an object with data we scraped for this h4 and push it to the results array
    // results.push({
    //   title: title,
    //   link: link
    // });
  });
  console.log(results);
});




// axios.get("https://www.foxnews.com/").then(function(resp) {
//   var $ = cheerio.load(resp.data);

//   var results = [];

//   $("h2.title").each(function(i, element) {
//     // Save the text of the child of the h2-tag with class 'title' as "title"
//     var title = $(element).children().text();
//     // console.log(title);

//     var link = $(element).children().attr("href");
//     // console.log(link);

//     // Make an object with data we scraped for this h4 and push it to the results array
//     results.push({
//       title: title,
//       link: link
//     });
//   });
//   console.log(results);
// });